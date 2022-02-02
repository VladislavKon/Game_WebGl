import { RootState } from './../app/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useAppDispatch } from '../app/hooks';
import signalR from '@microsoft/signalr';

interface Message{
    text: string,
    author: string
}


export interface ChatState {
    messages: Message[],
}

const initialState: ChatState = {
    messages: [],
}

interface GetCurrentUserResponse{
    isOk: boolean,
    userName?: string,
    error?: boolean
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("messageReceived", (username: string, message: string) => {
    
});

connection.start().catch(err => document.write(err));



export const authSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        send: (state: ChatState, action: PayloadAction<{username: string, message: string}> ) => {
            connection.send("newMessage", action.payload.username, action.payload.message);
        },
    }
});

export const { send } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated

export default authSlice.reducer;



function useAppSelector(arg0: (state: any) => any) {
    throw new Error('Function not implemented.');
}

