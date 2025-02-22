import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { getModule } from '@jwp/ott-common/src/modules/container';
import AccountController from '@jwp/ott-common/src/controllers/AccountController';
import AccountCircle from '@jwp/ott-theme/assets/icons/account_circle.svg?react';
import Favorite from '@jwp/ott-theme/assets/icons/favorite.svg?react';
import BalanceWallet from '@jwp/ott-theme/assets/icons/balance_wallet.svg?react';
import Exit from '@jwp/ott-theme/assets/icons/exit.svg?react';
import { PATH_USER_ACCOUNT, PATH_USER_FAVORITES, PATH_USER_PAYMENTS } from '@jwp/ott-common/src/paths';

import styles from '../UserMenu/UserMenu.module.scss'; // TODO inherit styling
import MenuButton from '../MenuButton/MenuButton';
import Icon from '../Icon/Icon';

type Props = {
  small?: boolean;
  focusable: boolean;
  showPaymentItems: boolean;
  onButtonClick?: () => void;
  titleId?: string;
  favoritesEnabled?: boolean;
};

const UserMenuNav = ({ showPaymentItems, small = false, onButtonClick, favoritesEnabled, focusable, titleId }: Props) => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();
  const accountController = getModule(AccountController);
  const tabIndex = focusable ? 0 : -1;

  const onLogout = useCallback(async () => {
    if (onButtonClick) {
      onButtonClick();
    }

    await accountController.logout();
    navigate('/', { replace: true });
  }, [onButtonClick, navigate, accountController]);

  return (
    <>
      <h2 className={styles.sectionHeader} id={titleId}>
        {t('nav.settings')}
      </h2>
      <ul className={styles.menuItems}>
        <li>
          <MenuButton
            small={small}
            onClick={onButtonClick}
            to={PATH_USER_ACCOUNT}
            label={t('nav.account')}
            startIcon={<Icon icon={AccountCircle} />}
            tabIndex={tabIndex}
          />
        </li>
        {favoritesEnabled && (
          <li>
            <MenuButton
              small={small}
              onClick={onButtonClick}
              to={PATH_USER_FAVORITES}
              label={t('nav.favorites')}
              startIcon={<Icon icon={Favorite} />}
              tabIndex={tabIndex}
            />
          </li>
        )}
        {showPaymentItems && (
          <li>
            <MenuButton
              small={small}
              onClick={onButtonClick}
              to={PATH_USER_PAYMENTS}
              label={t('nav.payments')}
              startIcon={<Icon icon={BalanceWallet} />}
              tabIndex={tabIndex}
            />
          </li>
        )}
        <li className={classNames(styles.divider, { [styles.small]: small })}>
          <MenuButton small={small} onClick={onLogout} label={t('nav.logout')} startIcon={<Icon icon={Exit} />} tabIndex={tabIndex} />
        </li>
      </ul>
    </>
  );
};

export default UserMenuNav;
