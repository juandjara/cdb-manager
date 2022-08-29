import React, { useMemo } from 'react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { AUTH_MODES } from '@/lib/authConfig'
import { useAlertSetter } from '@/lib/AlertContext'
import { authClient, decodeToken } from '@/lib/authConfig'
import { useMutation } from 'react-query'
import { XIcon } from '@heroicons/react/outline'

export default function AuthInput({ form, setForm }) {
  function update(key, value) {
    setForm((form) => ({ ...form, [key]: value }))
  }

  return form.authMode === AUTH_MODES.RAW ? (
    <Input
      id="accessToken"
      label="Access Token"
      value={form.accessToken || ''}
      onChange={(ev) => update('accessToken', ev.target.value)}
      corner={
        <Button
          type="button"
          padding="px-2 py-1"
          backgroundColor="bg-transparent"
          onClick={() => update('authMode', AUTH_MODES.OAUTH)}
        >
          OAuth Login
        </Button>
      }
    />
  ) : (
    <OAuthConfig
      form={form}
      setForm={setForm}
      onToggle={() => update('authMode', AUTH_MODES.RAW)}
    />
  )
}

function OAuthConfig({ form, setForm, onToggle }) {
  const setAlert = useAlertSetter()
  const decodedToken = useMemo(
    () => decodeToken(form.accessToken),
    [form.accessToken]
  )

  const mutation = useMutation(
    async () => {
      const token = await authClient.getTokenWithPopup()
      update('accessToken', token)
    },
    {
      onError: (err) => {
        setAlert(`Error loggin in ${err}`)
        // eslint-disable-next-line
        console.error(err)
      }
    }
  )

  function login() {
    mutation.mutate()
  }

  function logout() {
    update('accessToken', '')
    authClient.logout({
      returnTo: window.location.origin
    })
  }

  function update(key, value) {
    setForm((form) => ({ ...form, [key]: value }))
  }

  const isAuthenticated = !!decodedToken

  return (
    <div className="bg-gray-100 bg-opacity-75 rounded-xl p-3 relative">
      <Button
        onClick={onToggle}
        padding="p-1"
        color="gray"
        className="rounded-full absolute -top-1 -right-1"
      >
        <XIcon className="w-4 h-4" />
      </Button>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">OAuth Config</p>
        <div className="flex-grow"></div>
        {/* <div className="border h-6 border-gray-300 mx-2"></div> */}
        <Button
          type="button"
          padding="px-2 py-1"
          backgroundColor="bg-transparent"
          onClick={login}
        >
          {isAuthenticated ? 'Refresh' : 'Login'}
        </Button>
        {isAuthenticated && (
          <Button
            type="button"
            padding="px-2 py-1"
            backgroundColor="bg-transparent"
            onClick={logout}
          >
            Logout
          </Button>
        )}
      </div>
      <Input
        id="accessToken"
        label="Access Token"
        className="mt-4"
        value={form.accessToken}
        disabled
      />
    </div>
  )
}
