import { actionTypes, actions } from "../actions";

const SendToAlfred = ({
    enhancements,
    message,
}) => {
    const { ws } = enhancements;
    ws.send(JSON.stringify(message));
};

const OnConnectedToAlfred = ({
    dispatch,
    enhancements,
}) => {
    // @ts-ignore
    SendToAlfred({
        enhancements,
        message: {
            "Hello": "World",
        },
    });
};

const OnConnectToAlfred = ({
    dispatch,
    enhancements,
    getState,
}) => {
    dispatch(actions.ClearAlfredError());
    dispatch(actions.ConnectingToAlfred());
    const ws = new WebSocket(`wss://localhost:8100/ws`);
    enhancements.ws = ws;
    ws.addEventListener(
        'open',
        (event) => {
            console.log("Connected to Alfred");
            dispatch(actions.ConnectedToAlfred());
        }
    );
    ws.addEventListener(
        'close',
        (event) => {
            console.log("Disconnected from Alfred");
            enhancements.ws = null;
            if (getState().app.connectingToAlfred) {
                dispatch(actions.SetAlfredError({error: "failed to connect"}));
            }
            dispatch(actions.DisconnectedFromAlfred());
        }
    );
    ws.addEventListener(
        'message',
        (event) => {
            const decodedMessage = JSON.parse(event.data);
            console.log("PogChamp Alfred spoke to us!", decodedMessage);
        }
    );
};

const OnDisconnectFromAlfred = ({
    dispatch,
    enhancements,
}) => {
    const { ws } = enhancements;
    if (!ws) {
        return;
    }
    console.log("Disconnecting from Alfred");
    ws.close();
    enhancements.ws = null;
    dispatch(actions.DisconnectedFromAlfred());
};

const handlers = {
    [actionTypes.ConnectedToAlfred]: OnConnectedToAlfred,
    [actionTypes.ConnectToAlfred]: OnConnectToAlfred,
    [actionTypes.DisconnectFromAlfred]: OnDisconnectFromAlfred,
};

export default function({ getState, dispatch }) {
    const enhancements = {
        ws: null,
    };
    return next => action => {
        next(action);
        const handler = handlers[action.type];
        if (handler) {
            // @ts-ignore
            handler({action, dispatch, enhancements, getState});
        }
    };
};
