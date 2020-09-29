const ipc = require('node-ipc');

class SystemIPC {

    constructor(clientId, appName, appSpace = 'app.', pipeRoot = '/tmp/') {
        this.clientId = clientId;
        this.appName  = appName;
        this.appSpace = appSpace;
        this.pipeRoot = pipeRoot;
    }

    startClient() {

        ipc.config.socketRoot = this.pipeRoot;
        ipc.config.appspace = this.appSpace;
        ipc.config.id = this.clientId;
        ipc.config.retry = 1500;
        ipc.config.rawBuffer = true;
        ipc.config.encoding = 'utf8';
        ipc.log('## ipc configured ##');

        ipc.connectTo(
            this.appName,
            function () {
                ipc.of.world.on(
                    'connect',
                    function () {
                        ipc.log('## connected to world ##', ipc.config.delay);
                        ipc.of.world.emit(
                            'hello'
                        );
                    }
                );

                ipc.of.world.on(
                    'data',
                    function (data) {
                        ipc.log('got a message from world : ', data, data.toString());
                    }
                );
            }
        );

    }

    startServer() {

        ipc.config.socketRoot = this.pipeRoot;
        ipc.config.appspace = this.appSpace;
        ipc.config.id = this.appName;
        ipc.config.retry = 1500;
        ipc.config.rawBuffer = true;
        ipc.config.encoding = 'utf8';

        ipc.serve(
            function () {
                ipc.server.on(
                    'connect',
                    function (socket) {
                        ipc.server.emit(
                            socket,
                            'hello'
                        );
                    }
                );

                ipc.server.on(
                    'data',
                    function (data, socket) {
                        ipc.log('got a message', data, data.toString());
                        ipc.server.emit(
                            socket,
                            data.toString()
                        );
                    }
                );
            }
        );

        ipc.server.start();
    }
}

// Export Class
module.exports = SystemIPC;

