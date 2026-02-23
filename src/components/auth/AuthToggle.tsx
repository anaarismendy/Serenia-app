'use client'

import { Button } from '@/components/ui/button'

interface AuthToggleProps {
  isLogin: boolean
  onToggle: () => void
}

export function AuthToggle({ isLogin, onToggle }: AuthToggleProps) {
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        <Button
          variant="link"
          onClick={onToggle}
          className="ml-1 p-0 h-auto font-normal"
        >
          {isLogin ? 'Regístrate' : 'Inicia sesión'}
        </Button>
      </p>
    </div>
  )
}
