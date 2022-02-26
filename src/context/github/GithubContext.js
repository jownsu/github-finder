import React, { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

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

        const response = await fetch(`${GITHUB_URL}/search/users?q=${text}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        })

        const { items } = await response.json()
        dispatch({
            type: 'GET_USERS',
            payload: items,
        })
    }

    const getUser = async (login) => {
        setLoading()

        const response = await fetch(`${GITHUB_URL}/users/${login}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        })

        const data = await response.json()
        dispatch({
            type: 'GET_USER',
            payload: data,
        })
    }

    const getUserRepos = async (login) => {
        setLoading()

        const response = await fetch(
            `${GITHUB_URL}/users/${login}/repos?sort=created&per_page=10`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
        )

        const data = await response.json()
        dispatch({
            type: 'GET_REPOS',
            payload: data,
        })
    }

    const setLoading = () => dispatch({ type: 'SET_LOADING' })

    const clearUsers = () => dispatch({ type: 'CLEAR_USERS' })

    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                user: state.user,
                repos: state.repos,
                loading: state.loading,
                searchUsers,
                clearUsers,
                getUser,
                getUserRepos,
            }}
        >
            {children}
        </GithubContext.Provider>
    )
}

export default GithubContext
