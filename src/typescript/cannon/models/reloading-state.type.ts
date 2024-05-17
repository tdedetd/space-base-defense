export type ReloadingState = {
  status: 'reloading',
  progress: number
} | {
  status: 'ready'
};
