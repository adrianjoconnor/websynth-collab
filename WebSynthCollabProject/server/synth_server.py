# Socket server in python using select functi
import sys, socket, select, os, MySQLdb, json, time, thread, struct
from base64 import b64encode
from hashlib import sha1
from mimetools import Message
from StringIO import StringIO

if __name__ == "__main__":
    # config file is passed as the first command line parameter.
    RECV_BUFFER = 2048 # power of 2
    PORT = 6520
    
    currentClientID = 1
    
    def loadDbParams ():
        "Sets database parameters from config file"
        global db_host
        global db_user
        global db_password
        global db_dbname
        filepath = sys.argv[1]
        config_file = open(filepath, 'r')
        config_string = config_file.read()
        print config_string
        dbParams = json.loads( config_string )
        config_file.close()
        db_host = dbParams["host"]
        db_user = dbParams["user"]
        db_password = dbParams["password"]
        db_dbname = dbParams["dbname"]
        
    def getDbParams ():
        "Returns database parameters"
        global db_host
        global db_user
        global db_password
        global db_dbname
        return db_host, db_user, db_password, db_dbname
        
    def prepareDb ():
        "Creates table if it doesn't already exist."
        host, user, password, dbname = getDbParams()
        db = MySQLdb.connect( host, user, password, dbname )
        cursor = db.cursor()
        cursor.execute( "CREATE TABLE IF NOT EXISTS Collab_IDs ( id CHAR(24) NOT NULL PRIMARY KEY );" )
        db.close()
    
    db_host = None
    db_user = None
    db_password = None
    db_dbname = None
    loadDbParams()
    prepareDb()
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt( socket.SOL_SOCKET, socket.SO_REUSEADDR, 1 )
    server_socket.bind( ("0.0.0.0", PORT) ) # 0.0.0.0 binds to all available IPV4 addresses.
    server_socket.listen(5)
    
    Clients = []
    
    class ConnectedClient(object):
        clientID = 0
        collabID = ""
        connection = None
        latencyEst = None
        
        def __init__( self, clientID, collabID, connection, latencyEst ):
            self.clientID = clientID
            self.collabID = collabID
            self.connection = conection
            self.latencyEst = latencyEst
    
    def generateNewCollabId ():
        "Generates a new collab ID, unique in the collab ID database."
        valid_id = False
        new_collabid = os.urandom(24).decode("utf-8")
        # DB code here ( Check for the stupidly unlikely event that this collab id is taken.
        # No user input is taken in this code.
        host, user, password, dbname = getDbParams()
        db = MySQLdb.connect( host, user, password, dbname )
        cursor = db.cursor()
        while not valid_id:
            cursor.execute( """SELECT id FROM  Collab_IDs
                            WHERE id = %s;""", ( new_collabid, ) )
            numrows = int (cursor.rowcount)
            if numrows == 0:
                valid_id = True
                cursor.execute( "INSERT INTO Collab_IDs VALUES (%s);", ( new_collabid, ) )
                db.commit()
        db.close()
        return new_collabid
        
    def checkIfCollabIdExists ( collabid ) :
        "Check if Collab ID provided by the user exists."
        # User input is taken in this code.
        host, user, password, dbname = getDbParams()
        db = MySQLdb.connect( host, user, password, dbname )
        cursor = db.cursor()
        while not valid_id:
            cursor.execute( """SELECT id FROM  Collab_IDs
                            WHERE id = %s;""", ( collabid, ) )
            numrows = int (cursor.rowcount)
            db.close()
            if numrows == 0:
                return False
            else:
                return True
    
    print "Collab server started on port " + str(PORT)
    
    def send_message( connection, message ):
        connection.send(chr(129))
        length = len(message)
        if length <= 125:
            connection.send(chr(length))
        elif length >= 126 and length <= 65535:
            connection.send(126)
            connection.send(struct.pack(">H", length))
        else:
            connection.send(127)
            connection.send(struct.pack(">Q", length))
        connection.send(message)
    
    def clientThread ( connection, clientID ):
        #Sending message to connected client
        preSendTime = lambda: int( round( time.time() * 1000 ) )
        
        # deal with websocket handshake here
        
        magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
        
        data = connection.recv(1024).strip()
        headers = Message(StringIO(data.split('\r\n', 1)[1]))
        if headers.get("Upgrade", None) != "websocket":
            return
        print 'Handshaking...'
        key = headers['Sec-WebSocket-Key']
        digest = b64encode(sha1(key + magic).hexdigest().decode('hex'))
        response = 'HTTP/1.1 101 Switching Protocols\r\n'
        response += 'Upgrade: websocket\r\n'
        response += 'Connection: Upgrade\r\n'
        response += 'Sec-WebSocket-Accept: %s\r\n\r\n' % digest
        connection.send(response)
        
        print "handshake apparently done."
        
        send_message ( connection, '{"msgtype": "id"}' )
        
        
        
        """connection.send( '{"msgtype": "id"}' )
        
        print "tried sending id request json"
        
        data = connection.recv(RECV_BUFFER)
        
        print "tried receiving from client"
        
        receivedMessage = json.loads( data )
        postSendTime = lambda: int( round( time.time() * 1000 ) )
        latencyEst = ( postSendTime - preSendTime ) / 2
        name = None
        newId = None
        global Clients
        
        if receivedMessage["msgtype"] == "getid":
            newId = generateNewCollabId()
            name = receivedMessage["name"]
            messageObject = {"msgtype":"setid", "collabid":newId}
            connection.send( json.dumps( messageObject ) )
        elif receivedMessage["msgtype"] == "setid":
            name = receivedMessage["name"]
            if ( checkIfCollabIdExists( receivedMessage["collabid"] ) ):
                messageObject = {"msgtype":"id_ok"}
                connection.send( json.dumps( messageObject ) )
                newId = receivedMessage["collabid"]
            else:
                messageObject = {"msgtype":"setid" , "collabid":generateNewCollabId() }
                newId = messageObject["collabid"]
                connection.send( json.dumps( messageObject ) )
        else:
            print "Invalid message received."
            # invalid message
            
        if not newId == None:
            # send highest current latency to this client
            currentHighestLatency = 10
            for client in Clients:
                if client.collabID == newId and client.latencyEst > currentHighestLatency:
                    currentHighestLatency = client.latencyEst
            messageObject = {"msgtype":"onward-latency-update", "latency":currentHighestLatency}
            connection.send( json.dumps( messageObject ) )
                    
            
            # then send the new client's latency to the other clients.
            # latencyEst
            messageObject = {"msgtype":"onward-latency-update", "latency":latencyEst}
            for client in Clients:
                if client.collabID == newId:
                    client.connection.send( json.dumps( messageObject ) )
                    messageObject = {"msgtype":"client-joined", "name":name}
                    client.connection.send( json.dumps( messageObject ) )
            
            newClient = ConnectedClient( clientID, newId, connection, latencyEst )
            Clients.append( newClient )
            
            while True:
                data = connection.recv(RECV_BUFFER)
                
                if not data:
                    break
                
                # iterate through clients and send to ones with collabid that aren't this clientid
                for client in Clients:
                    if ( not client.clientID == clientID ) and client.collabID == newId:
                        receivedMessage = json.loads(data)
                        if not receivedMessage.msgtype == "chat":
                            receivedMessage.name = name
                            client.connection.send( json.dumps( receivedMessage ) )
                        else:
                            client.connection.send( data )
            
        
        
        connection.close()
        
        """
        
    
    while True:
        #wait to accept a connection - blocking call
        connection, addr = server_socket.accept()
        
        currentClientID += 1
        print 'Connected with ' + addr[0] + ':' + str(addr[1])
        
        #start new thread takes 1st argument as a function name to be run, second is the tuple of arguments to the function.
        thread.start_new_thread( clientThread ,(connection, currentClientID ) )
        
    server_socket.close()