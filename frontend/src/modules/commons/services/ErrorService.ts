import { inject } from 'vue';

export function useErrorDialog() {
  const errorDialog = inject<any>('errorDialog');

  if (!errorDialog) {
    throw new Error('GlobalErrorDialog não foi registrado!');
  }

  return {
    showError(message: string) {
      errorDialog.openDialog(message);
    }
  };
}
