export const handleRequest = async <T>(
  promise: Promise<T>
): Promise<[T | null, any | null]> => {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, error];
  }
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type UnionToFunctions<U> = U extends unknown ? (k: U) => void : never;

type IntersectionOfFunctionsToType<F> = F extends {
  (a: infer A): void;
  (b: infer B): void;
}
  ? [A, B]
  : never;

type SplitType<T> = IntersectionOfFunctionsToType<
  UnionToIntersection<UnionToFunctions<T>>
>;

type MinaRequestResType<T> = SplitType<T>[0];
type MinaRequestErrorType<T> = SplitType<T>[1];

export async function handleRequestWithError<T>(
  cb: Promise<T>
): Promise<[MinaRequestResType<T>, null] | [null, MinaRequestErrorType<T>]> {
  try {
    return [await cb, null];
  } catch (error: unknown) {
    return [null, error as MinaRequestErrorType<T>];
  }
}
