import '@jwp/ott-common/src/modules/register';
import { container } from '@jwp/ott-common/src/modules/container';
import StorageService from '@jwp/ott-common/src/services/StorageService';
import { GET_CUSTOMER_IP } from '@jwp/ott-common/src/modules/types';
import type { GetCustomerIP } from '@jwp/ott-common/types/get-customer-ip';
import LogTransporter from '@jwp/ott-common/src/services/logging/LogTransporter';
import ConsoleTransporter from '@jwp/ott-common/src/services/logging/ConsoleTransporter';
import { LogLevel } from '@jwp/ott-common/src/services/logging/LogLevel';

import { getOverrideIP } from '#src/utils/ip';
import { LocalStorageService } from '#src/services/LocalStorageService';

/**
 * Custom integration override
 *
 * @example
 * ```ts
 * // Custom integration services
 * const MY_INTEGRATION_NAME = 'CUSTOM';
 *
 * container.bind(AccountService).to(CustomAccountService).whenTargetNamed(MY_INTEGRATION_NAME);
 * container.bind(CheckoutService).to(CustomCheckoutService).whenTargetNamed(MY_INTEGRATION_NAME);
 * container.bind(SubscriptionService).to(CustomSubscriptionService).whenTargetNamed(MY_INTEGRATION_NAME);
 *
 * // Override integration type calculation
 * container.bind(DETERMINE_INTEGRATION_TYPE).toConstantValue((config: Config) => {
 *   return config.custom?.['custom'] ? MY_INTEGRATION_NAME : null;
 * })
 * ```
 */

container.bind(StorageService).to(LocalStorageService);

// Currently, this is only used for e2e testing to override the customer ip from a browser cookie
container.bind<GetCustomerIP>(GET_CUSTOMER_IP).toConstantValue(async () => getOverrideIP());

/**
 * Log transporters
 *
 * Add custom log transporters by registering more modules to the LogTransporter type. The custom transporter must
 * extend the LogTransporter class.
 *
 * @example
 * ```ts
 * container.bind<LogTransporter>(LogTransporter).toDynamicValue(() => new GoogleGTMTransporter(import.meta.env.DEV ? LogLevel.SILENT : LogLevel.WARN));
 * ```
 */
container.bind<LogTransporter>(LogTransporter).toDynamicValue(() => new ConsoleTransporter(import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.ERROR));

/**
 * UI Component override
 *
 * @example
 * ```ts
 * // Define in types.ts (from `ui-react` for example)
 * const TAG_IDENTIFIER = 'TAG_IDENTIFIER';
 *
 * // Bind custom component
 * container.bind(TAG_IDENTIFIER).toConstantValue(CustomTag);
 *
 * // Then wrap the component in a HOC, from the component file itself
 * export default createInjectableComponent(TAG_IDENTIFIER, DefaultTag);
 *
 * ```
 */

// Override ui-react component
// uiComponentContainer.bind<React.FC<TagProps>>(TAG_IDENTIFIER).toConstantValue(Tag);
