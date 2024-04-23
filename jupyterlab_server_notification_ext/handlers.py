import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

class RouteHandler(APIHandler):

    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        data = {"greetings": "Hello {}, enjoy JupyterLab!".format(input_data["data"]["required"])}
        self.event_logger.emit(
            schema_id="http://event.mockextension.jupyter.org/message",
            data={"event_message":"Hello {}, enjoy JupyterLab Events!".format(input_data["data"]["required"]), "label": "Congratulations",  "status": "success", "event_type":"analytic"}
        )
        # Emit an event.
 
def setup_handlers(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "jupyterlab-server-notification-ext", "event")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
