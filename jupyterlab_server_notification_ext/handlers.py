import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        data = {"status": "success", "message": { "text" : "Notification succes", "details": "Everything is alright"}, "delay": 3000}
        self.finish(json.dumps(data))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()
        data = {"greetings": "Hello {}, enjoy JupyterLab!".format(input_data["name"])}
        self.finish(json.dumps(data))
    
    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        self.event_logger.emit(
            schema_id="http://event.mockextension.jupyter.org/message",
            data={"event_message": "Test!", "status": "success", "event_type":"analytic"}
        )
        # Emit an event.
 
def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "jupyterlab-server-notification-ext", "get-notification")
    handlers = [(route_pattern, RouteHandler),(url_path_join(base_url, "mock", "event"), RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
