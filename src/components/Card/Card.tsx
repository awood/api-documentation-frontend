import {FunctionComponent, PropsWithChildren, MouseEvent, KeyboardEvent} from 'react';
import {Card as PFCard, CardBody, Split, SplitItem, Text, TextContent, TextVariants} from '@patternfly/react-core';

import {APIConfigurationIcons} from '@apidocs/common';

export interface CardProps {
  apiId: string;
  displayName: string;
  icon?: keyof typeof APIConfigurationIcons;
  description: string;
  onClick: () => void;
  onCtrlClick?: () => void;
}

export const Card: FunctionComponent<PropsWithChildren<CardProps>> = ({apiId, displayName, icon, description, onClick, onCtrlClick, children}) => {
  const TitleIcon = icon ? APIConfigurationIcons[icon] : APIConfigurationIcons.GenericIcon;

  const onCardClick = (event: MouseEvent) => {
    // By-pass click if we actually clicked on a button (or it's children)
    const clickedAButton = event.target instanceof Element && event.target.closest('button');
    if (!clickedAButton) {
      if (event.ctrlKey && onCtrlClick) {
        onCtrlClick();
      } else {
        onClick();
      }
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (["Enter", "Space"].includes(event.code)) {
      onClick();
    }
  }

  return <PFCard
    onClick={onCardClick}
    onKeyDown={onKeyDown}
    role="link"
    isSelectableRaised
    isFullHeight
    ouiaId={apiId}
     >
      <CardBody>
        <Split className="pf-u-mb-sm">
          <SplitItem>
            <TitleIcon />
          </SplitItem>
          <SplitItem>
            <Text component="p" className="pf-u-font-size-md pf-u-m-sm pf-u-ml-md">
              {displayName}
            </Text>
          </SplitItem>
          </Split>
        <TextContent>

          <Text component={TextVariants.small}>
            {description}
          </Text>
        </TextContent>
        {children}
      </CardBody>
    </PFCard>
};
