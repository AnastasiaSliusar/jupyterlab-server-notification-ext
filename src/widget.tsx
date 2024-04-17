import { ReactWidget } from '@jupyterlab/ui-components';

import React from 'react';
import { requestAPI } from './handler';
import { Notification } from '@jupyterlab/apputils';

export interface INotification {
  /**
   * The status of backend.
   */
  status: 'success' | 'error';

  /**
   * Message information for a notification.
   */
  message: {
    /**
     * Notification message.
     */
    text: 'string';

    /**
     * notification detailed information.
     */
    details: 'string';
  };

  /**
   * Milliseconds of notification delay
   */
  delay: number;
}

/**
 * Button component which is used to show notification and sending requests to backend.
 *
 * @returns The React component
 */
const ButtonComponent = (): JSX.Element => {
  //const [data, setData] = useState({});

  const showNotification = ({
    status,
    message,
    delay
  }: INotification): void => {
    Notification[status](message.text, {
      actions: [
        { label: 'More information', callback: () => alert(message.details) }
      ],
      autoClose: delay
    });
  };

  const handleClick = (): void => {
    requestAPI<any>('get-notification')
      .then(data => {
        showNotification(data);
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_server_notification_ext server extension appears to be missing.\n${reason}`
        );
      });
  };

  return (
    <div>
      <p>You will see notifications after clicking</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

/**
 * A Button Lumino Widget that wraps a ButtonComponent.
 */
export class ButtonWidget extends ReactWidget {
  /**
   * Constructs a new ButtonWidget.
   */
  constructor() {
    super();
    this.addClass('jp-react-widget');
  }

  render(): JSX.Element {
    return <ButtonComponent />;
  }
}
