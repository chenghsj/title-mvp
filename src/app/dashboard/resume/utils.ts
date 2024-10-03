import { getTranslations } from 'next-intl/server';

export function getYouTubeVideoId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?[\S]*)?/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const getTranslationsByType = async (
  mode: keyof IntlMessages['components']['responsiveDialog']['buttons']
) => {
  const tComponentsToast = await getTranslations('components.toast');
  const tComponentsResponsiveDialogButtons = await getTranslations(
    'components.responsiveDialog.buttons'
  );
  const dialogMode = tComponentsResponsiveDialogButtons(mode);

  return {
    title: tComponentsToast('success.title'),
    description: tComponentsToast('success.resume.description', {
      mode: dialogMode.toLowerCase(),
    }),
  };
};
