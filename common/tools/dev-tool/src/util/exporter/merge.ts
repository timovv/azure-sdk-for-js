export interface SuccessfulMerge<T> {
  result: "succeeded";
  value: T;
}

export interface FailedMerge {
  result: "failed";
  reason: string;
}

type MergeResult<T> = SuccessfulMerge<T> | FailedMerge;

export type MergeStrategy<T> = (left: T, right: T) => MergeResult<T>;

export function success<T>(value: T): SuccessfulMerge<T> {
  return {
    result: "succeeded",
    value,
  };
}

export function failure(reason: string): FailedMerge {
  return {
    result: "failed",
    reason,
  };
}

export function merge<T>(strategy: MergeStrategy<T>, left: T, right: T) {
  const result = strategy(left, right);
  if (result.result === "succeeded") {
    return result.value;
  } else {
    throw new Error(`Failed to merge: ${result.reason}`);
  }
}

export function useRightValue<T>(): MergeStrategy<T> {
  return (_left, right) => success(right);
}

export function useLeftValue<T>(): MergeStrategy<T> {
  return (left, _right) => success(left);
}

type AreEqual<T> = (a: T, b: T) => boolean;
function defaultAreEqual<T>(a: T, b: T) {
  return a === b;
}

export function assertSame<T>(areEqual: AreEqual<T> = defaultAreEqual): MergeStrategy<T> {
  return (left, right) => {
    if (areEqual(left, right)) {
      return success(right);
    } else {
      return failure(`Merge failed, expected ${left} to equal ${right}`);
    }
  };
}

export function useLiteralValue<T>(literal: T): MergeStrategy<T> {
  return (_left, _right) => success(literal);
}

export function mergeIntoSet<TElements>(
  areEqual: AreEqual<TElements> = defaultAreEqual
): MergeStrategy<TElements[]> {
  return (left, right) => {
    const intersection = right.filter((x) => left.some((y) => areEqual(x, y)));
    const onlyInLeft = left.filter((x) => !intersection.some((y) => areEqual(x, y)));
    const onlyInRight = right.filter((x) => !intersection.some((y) => areEqual(x, y)));

    return success([...onlyInLeft, ...intersection, ...onlyInRight]);
  };
}

export function mergeByConcatenation<TElements>(): MergeStrategy<TElements[]> {
  return (left, right) => success([...left, ...right]);
}

export function mergeShape<TShape extends {}>(strategiesByProperty: {
  [K in keyof TShape]?: MergeStrategy<NonNullable<TShape[K]>>;
}) {
  return (a: TShape, b: TShape) => {
    const result: Partial<TShape> = {};

    const mergeKeysResult = mergeIntoSet()(Object.keys(a), Object.keys(b));

    if (mergeKeysResult.result === "failed") {
      return failure("Could not merge keys");
    } else {
      const combinedKeys = mergeKeysResult.value as any[];
      for (const key of combinedKeys) {
        const aValue = (a as any)[key];
        const bValue = (b as any)[key];

        if (aValue === null || aValue === undefined) {
          result[key as keyof TShape] = bValue;
        } else if (bValue === null || bValue === undefined) {
          result[key as keyof TShape] = aValue;
        } else {
          const mergePropertyResult = (
            strategiesByProperty[key as keyof TShape] ?? useRightValue()
          )(aValue, bValue);
          if (mergePropertyResult.result === "succeeded") {
            result[key as keyof TShape] = mergePropertyResult.value;
          } else {
            return failure(`Could not merge property ${key}`);
          }
        }
      }
    }

    return success(result as TShape);
  };
}

export function widen<T, U extends T>(
  isU: (x: T) => x is U,
  strategy: MergeStrategy<U>
): MergeStrategy<T> {
  return (left, right) => {
    if (isU(left) && isU(right)) {
      return strategy(left, right);
    } else {
      return failure("Could not narrow down strategy");
    }
  };
}

export function tryMerge<T>(...strategies: MergeStrategy<T>[]): MergeStrategy<T> {
  return (left, right) => {
    for (const strategy of strategies) {
      const result = strategy(left, right);
      if (result.result === "succeeded") {
        return result;
      }
    }

    return failure("None of the merge strategies worked");
  };
}
