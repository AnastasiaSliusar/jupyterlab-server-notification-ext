import { ReactWidget } from '@jupyterlab/ui-components';
import React from 'react';
import { IEventHandler } from './eventHandler';

/**
 * Button component which is used to show notification and sending requests to backend.
 *
 * @returns The React component
 */
const FormComponent = (props: {
  eventHandler: IEventHandler;
}): JSX.Element => {

 const eventHandler = props.eventHandler;

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const formData = Object.fromEntries((form as any).entries());
	console.dir(formData);

  const analyticData = {
    type: 'jupterlab_analytics',
    action: 'form_submit',
    name: 'form_react',
    data: formData
  };

  eventHandler.data('event', 'jupyterlab-server-notification-ext', {
    body: JSON.stringify(analyticData),
    method: 'POST'
  });
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Required:
          <input type="text" placeholder="" name="required" />
        </label>
        <label>
          Optional:
          <input type="text" placeholder="" name="optional" />
        </label>
        <label>
          With validation:
          <input type="text" placeholder="" name="with_validation" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

/**
 * A Button Lumino Widget that wraps a FormComponent.
 */
export class FormWidget extends ReactWidget {
  eventHandler: IEventHandler;
  /**
   * Constructs a new FormWidget.
   */
  constructor(eventHandler: IEventHandler) {
    super();
    //this.addClass('jp-react-widget');
    this.eventHandler = eventHandler;
    this.eventHandler.activateNotification(true);
  }

  render(): JSX.Element {
    return <FormComponent eventHandler={this.eventHandler} />;
  }
}
