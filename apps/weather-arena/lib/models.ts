// Описание на един модел в арената.
// Нарочно НЕ импортираме тук @ai-sdk/anthropic и @ai-sdk/google:
// този файл ще се ползва и от браузъра (за имената на колоните),
// а кодът на доставчиците трябва да остане само на сървъра.

export type Provider = 'anthropic' | 'google';

export type ModelInfo = {
  id: string;          // уникален ключ, който клиентът праща на сървъра
  label: string;       // името, което се показва в колоната
  provider: Provider;  // кой доставчик
  modelName: string;   // точното име на модела в API-то
  inputPrice: number;  // $ за 1 милион входни токена
  outputPrice: number; // $ за 1 милион изходни токена
};

export const MODELS: ModelInfo[] = [
  {
    id: 'claude-haiku',
    label: 'Claude Haiku 4.5',
    provider: 'anthropic',
    modelName: 'claude-haiku-4-5',
    inputPrice: 1,
    outputPrice: 5,
  },
  {
    id: 'claude-sonnet',
    label: 'Claude Sonnet 5.5',
    provider: 'anthropic',
    modelName: 'claude-sonnet-5-5',
    inputPrice: 2,
    outputPrice: 10,
  },
  {
    id: 'gemini-flash',
    label: 'Gemini Flash',
    provider: 'google',
    modelName: 'gemini-3.8-flash',
    inputPrice: 0, // попълни от страницата Pricing на Gemini
    outputPrice: 0,
  },
];

export function findModel(id: string): ModelInfo | undefined {
  return MODELS.find((model) => model.id === id);
}