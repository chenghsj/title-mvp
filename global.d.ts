import enUS from './messages/en-US.json';

type Messages = typeof enUS;

declare global {
  interface IntlMessages extends Messages {}
}
