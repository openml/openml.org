/**
 * @jest-environment jsdom
 */

import SignIn from "../../pages/auth/SignIn";
import { render } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/react'
import axios from 'axios'
import { BrowserRouter as Router } from "react-router-dom";

import { ThemeProvider } from "styled-components";
import { createTheme } from "@mui/material/styles";
import { MainContext } from "../../App.js";


function setup(jsx) {
    return {
        user: userEvent.setup(),
        ...render(<ThemeProvider theme={createTheme({})}>{jsx}</ThemeProvider>),
    }
}


jest.mock("axios")

describe("User Sign In", () => {
    test("Happy path", async () => {
        const context = {
            checkLogIn: () => jest.fn()
        }
        const {user} = setup(<MainContext.Provider value={context}><Router><SignIn /></Router></MainContext.Provider>);
        
        const mockServerResult = {
            "data": {
                "access_token": "test_token"
            }
        }
        axios.post.mockResolvedValueOnce(mockServerResult)
        Storage.prototype.setItem = jest.fn()

        const email = screen.getByLabelText(/Email/i)
        const password = screen.getByLabelText(/Password/i)
        const sign_in = screen.getByRole('button', {name: /Sign in/i})

        await user.type(password, "password")
        await user.type(email, "test@test.com")
        await user.click(sign_in);
        
        expect(axios.post).toHaveBeenCalledWith("https://www.openml.org/login", {"email": "test@test.com", "password": "password"})
        expect(localStorage.setItem).toHaveBeenCalledWith("token", "test_token")
    });

    test("Wrong username or password", async () => {
        const {user} = setup(<Router><SignIn /></Router>);
        
        const mockServerResult = {"data": {"msg": "Wrong username or password"}}
        axios.post.mockResolvedValueOnce(mockServerResult)
        Storage.prototype.setItem = jest.fn()

        const email = screen.getByLabelText(/Email/i)
        const password = screen.getByLabelText(/Password/i)
        // const password = screen.getByRole('textbox', {id: 'password'});  // Does not work, gets the same element as email. TODO: figure out why
        const sign_in = screen.getByRole('button', {name: /Sign in/i})

        await user.type(password, "password")
        await user.type(email, "test@test.com")
        await user.click(sign_in);

        expect(axios.post).toHaveBeenCalledWith("https://www.openml.org/login", {"email": "test@test.com", "password": "password"})
        const h3 = screen.getByRole("heading", {level: 3})
        expect(h3.textContent).toBe('Wrong username or password');
        expect(localStorage.setItem).not.toHaveBeenCalled()
    });

    test("Wrong password", async () => {
        // TODO: this test should be removed, after this "Wrong password" is not returned anymore by the backend
        const {user} = setup(<Router><SignIn /></Router>);
        
        const mockServerResult = {"data": {"msg": "wrong password"}}
        axios.post.mockResolvedValueOnce(mockServerResult)
        Storage.prototype.setItem = jest.fn()

        const email = screen.getByLabelText(/Email/i)
        const password = screen.getByLabelText(/Password/i)
        const sign_in = screen.getByRole('button', {name: /Sign in/i})

        await user.type(password, "password")
        await user.type(email, "test@test.com")
        await user.click(sign_in);

        expect(axios.post).toHaveBeenCalledWith("https://www.openml.org/login", {"email": "test@test.com", "password": "password"})
        const h3 = screen.getByRole("heading", {level: 3})
        expect(h3.textContent).toBe('Wrong username or password');
        expect(localStorage.setItem).not.toHaveBeenCalled()
    });

    test("Inactive user", async () => {
        const {user} = setup(<Router><SignIn /></Router>);
        
        const mockServerResult = {"data": {"msg": "NotConfirmed"}}
        axios.post.mockResolvedValueOnce(mockServerResult)
        Storage.prototype.setItem = jest.fn()

        const email = screen.getByLabelText(/Email/i)
        const password = screen.getByLabelText(/Password/i)
        const sign_in = screen.getByRole('button', {name: /Sign in/i})

        await user.type(password, "password")
        await user.type(email, "test@test.com")
        await user.click(sign_in);

        expect(axios.post).toHaveBeenCalledWith("https://www.openml.org/login", {"email": "test@test.com", "password": "password"})
        const h3 = screen.getByRole("heading", {level: 3})
        expect(h3.textContent).toBe('User not confirmed(resend activation token)');
        expect(localStorage.setItem).not.toHaveBeenCalled()
    });

    test("Error", async () => {
        const {user} = setup(<Router><SignIn /></Router>);
        
        axios.post.mockRejectedValueOnce(new Error('something bad happened', ))
        Storage.prototype.setItem = jest.fn()

        const email = screen.getByLabelText(/Email/i)
        const password = screen.getByLabelText(/Password/i)
        const sign_in = screen.getByRole('button', {name: /Sign in/i})

        await user.type(password, "password")
        await user.type(email, "test@test.com")
        await user.click(sign_in);

        expect(axios.post).toHaveBeenCalledWith("https://www.openml.org/login", {"email": "test@test.com", "password": "password"})
        const h3 = screen.getByRole("heading", {level: 3})
        expect(h3.textContent).toBe('Error: something bad happened');  // TODO: check if this is indeed how errors are send by the backend 
        expect(localStorage.setItem).not.toHaveBeenCalled()
    });
})