import { ReactWidget } from '@jupyterlab/ui-components';

import React, { useEffect, useState } from 'react';
import { requestAPI } from './handler';
import { Notification } from '@jupyterlab/apputils';

/**
 * React component for a counter.
 *
 * @returns The React component
 */
const CounterComponent = (): JSX.Element => {
  const [counter, setCounter] = useState(0);

  
  useEffect(()=>{
    if(counter) {
    requestAPI<any>('get-example')
    .then(data => {
      Notification.success('Congratulations, you created a notifications.');

      console.log(data);
    })
    .catch(reason => {
      console.error(
        `The jupyterlab_server_notification_ext server extension appears to be missing.\n${reason}`
      );
    });
  }
  },[counter]);

  return (
    <div>
      <p>You clicked {counter} times!</p>
      <button
        onClick={(): void => {
          setCounter(counter + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
};

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class CounterWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.addClass('jp-react-widget');
  }

  render(): JSX.Element {
    return <CounterComponent />;
  }
}