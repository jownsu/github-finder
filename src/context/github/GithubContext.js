import React, { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer'
import axios from 'axios'

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

const github = axios.create({
    baseURL: GITHUB_URL,
    headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
})

const GithubContext = createContext()

export const GithubProvider = ({ children }) => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false,
    }

    const [state, dispatch] = useReducer(githubReducer, initialState)

    const searchUsers = async (text) => {
        setLoading()
        const response = await github.get(`/search/users?q=${text}`)
        dispatch({ type: 'GET_USERS', payload: response.data.items })
    }

    const getUserAndRepos = async (login) => {
        setLoading()
        const [user, repos] = await Promise.all([
            github.get(`/users/${login}`),
            github.get(`/users/${login}/repos`),
        ])
        dispatch({
            type: 'GET_USER_AND_REPOS',
            payload: { user: user.data, repos: repos.data },
        })
    }

    const setLoading = () => dispatch({ type: 'SET_LOADING' })

    const clearUser = () => dispatch({ type: 'CLEAR_USERS' })

    return (
        <GithubContext.Provider
            value={{
                ...state,
                searchUsers,
                getUserAndRepos,
                clearUser,
            }}
        >
            {children}
        </GithubContext.Provider>
    )
}

export default GithubContext
