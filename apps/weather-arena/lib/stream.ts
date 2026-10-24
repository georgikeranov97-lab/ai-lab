// Тези низове отделят текста на модела от служебната информация в края на потока.
export const USAGE_MARKER = '\n\n__USAGE__';
export const ERROR_MARKER = '\n\n__ERROR__';

export type Usage = {
  inputTokens: number;
  outputTokens: number;
};