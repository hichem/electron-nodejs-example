const { app, BrowserWindow } = require('electron')
const ipc=require('node-ipc');

function createWindow () {
  // Cree la fenetre du navigateur.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // et charger le fichier index.html de l'application.
  win.loadFile('index.html')
}

// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })


  //function startClient() {
  /***************************************\
   *
   * You should start both hello and world
   * then you will see them communicating.
   *
   * *************************************/

  // ipc.config.socketRoot = 'C:\\tmp\\';
  // ipc.config.appspace = 'app.';
  ipc.config.id = 'hello';
  ipc.config.retry= 1500;
  ipc.config.rawBuffer=true;
  ipc.config.encoding='ascii';
  ipc.log('## ipc configured ##');

  ipc.connectTo(
      'world',
      function(){
          ipc.of.world.on(
              'connect',
              function(){
                  ipc.log('## connected to world ##', ipc.config.delay);
                  ipc.of.world.emit(
                      'hello'
                  );
              }
          );

          ipc.of.world.on(
              'data',
              function(data){
                  ipc.log('got a message from world : ', data,data.toString());
              }
          );
      }
  );

//}

function startServer() {
  /***************************************\
   *
   * You should start both hello and world
   * then you will see them communicating.
   *
   * *************************************/

  // ipc.config.socketRoot = 'C:\\tmp\\';
  // ipc.config.appspace = 'app.';
  ipc.config.id = 'world';
  ipc.config.retry= 1500;
  ipc.config.rawBuffer=true;
  ipc.config.encoding='ascii';

  ipc.serve(
      function(){
          ipc.server.on(
              'connect',
              function(socket){
                  ipc.server.emit(
                      socket,
                      'hello'
                  );
              }
          );

          ipc.server.on(
              'data',
              function(data,socket){
                  ipc.log('got a message', data,data.toString());
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
