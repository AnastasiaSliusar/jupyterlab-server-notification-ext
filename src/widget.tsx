import { ReactWidget } from '@jupyterlab/ui-components';
import React from 'react';
import { IEventHandler } from './eventHanlder';

/**
 * Button component which is used to show notification and sending requests to backend.
 *
 * @returns The React component
 */
const ButtonComponent = (props: {eventHanlder: IEventHandler}): JSX.Element => {
  const eventHanlder = props.eventHanlder;

  const handleClick = (): void => {
    const analyticData = {
      "type":"jupterlab_analytics",
      "action": "button_click",
      "name": "button_react"
    }

    eventHanlder.data("event", "jupyterlab-server-notification-ext", {
      "body": JSON.stringify(analyticData),
      "method": 'POST'
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
  eventHanlder: IEventHandler;
  /**
   * Constructs a new ButtonWidget.
   */
  constructor(eventHanlder: IEventHandler) {
    super();
    //this.addClass('jp-react-widget');
    this.eventHanlder = eventHanlder;
    this.eventHanlder.activateNotification(true);
  }

  render(): JSX.Element {
    return <ButtonComponent eventHanlder={this.eventHanlder}/>;
  }
}
