/* components/tabtitle/TabTitle.tsx */


import { SITE_CONFIG } from "@/utils/constants";

type TabTitleProps = {
  tabName: string;
};

export function TabTitle({ tabName }: TabTitleProps) {
  return (
    <title>
      {`${SITE_CONFIG.name} | ${tabName}`}
    </title>
  );
};