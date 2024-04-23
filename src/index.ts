import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { reactIcon } from '@jupyterlab/ui-components';
import { FormWidget } from './widget';
import { EventHandler } from './eventHandler';

/**
 * The command IDs used by the react-widget plugin.
 */
namespace CommandIDs {
  export const create = 'create-react-widget';
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_server_notification_ext/',
  description:
    'A JupyterLab extention to show notification after clicking on a button',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    console.log(
      'JupyterLab extension jupyterlab-server-notification-ext is activated!'
    );
    const { commands } = app;

    const command = CommandIDs.create;
    const eventHandler = new EventHandler(app.serviceManager.events);

    app.serviceManager.events.stream.connect((_, emission) => {
      if (emission.event_type === 'analytic' && eventHandler.activeNotification) {
        const status = emission.status as 'error' | 'success';

        const message = {
          title: emission.event_message as string,
          description: emission.description as string
        };

        const notification = {
          status,
          message,
          label: emission.label as string,
          delay: 3000
        };

        eventHandler.showNotification(notification);
      }
    });

    commands.addCommand(command, {
      caption: 'Create a React Button Notification Widget',
      label: 'React Button Notification Widget',
      icon: args => (args['isPalette'] ? undefined : reactIcon),
      execute: () => {
        const content = new FormWidget(eventHandler);
        const widget = new MainAreaWidget<FormWidget>({ content });
        widget.title.label = 'React Button Notification Widget';
        widget.title.icon = reactIcon;
        app.shell.add(widget, 'main');
      }
    });

    if (launcher) {
      launcher.add({
        command
      });
    }
  }
};

export default extension;
