'use client';

import { useState } from 'react';

const steps = ['Empresa', 'Administrador', 'Listo'];

const sectores = [
  'Transporte y logística',
  'Construcción',
  'Servicios técnicos',
  'Reparto y mensajería',
  'Agricultura',
  'Sanidad',
  'Otros',
];

function generateCode(name: string) {
  const prefix = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  placeholder?: string;
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function RegistroEmpresa() {
  const [step, setStep] = useState(0);
  const [empresa, setEmpresa] = useState({
    nombre: '',
    cif: '',
    sector: '',
    vehiculos: '',
  });
  const [admin, setAdmin] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  function validateEmpresa() {
    const e: Record<string, string> = {};
    if (!empresa.nombre.trim()) e.nombre = 'Introduce el nombre de la empresa';
    if (!empresa.cif.trim()) e.cif = 'Introduce el CIF';
    else if (!/^[A-Z]\d{7}[0-9A-J]$/.test(empresa.cif.toUpperCase()))
      e.cif = 'Formato CIF no válido (ej: B12345678)';
    if (!empresa.sector) e.sector = 'Selecciona un sector';
    if (!empresa.vehiculos || Number(empresa.vehiculos) < 1)
      e.vehiculos = 'Indica el número de vehículos';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateAdmin() {
    const e: Record<string, string> = {};
    if (!admin.nombre.trim()) e.nombre = 'Introduce tu nombre';
    if (!admin.email.trim()) e.email = 'Introduce tu email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email))
      e.email = 'Email no válido';
    if (admin.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (admin.password !== admin.confirmPassword)
      e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 0 && validateEmpresa()) setStep(1);
    else if (step === 1 && validateAdmin()) setStep(2);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Órbita</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Control de flota para tu empresa</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Progress bar */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className={`flex items-center gap-2 ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      i < step ? 'bg-blue-600 border-blue-600 text-white' :
                      i === step ? 'border-blue-600 text-blue-600' :
                      'border-gray-300 text-gray-400'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-12 mx-2 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">

            {/* Step 1 — Company data */}
            {step === 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Datos de la empresa</h2>
                <p className="text-gray-500 text-sm mb-5">Información básica para crear tu cuenta</p>

                <Field
                  label="Nombre de la empresa"
                  name="nombre"
                  value={empresa.nombre}
                  onChange={(n, v) => setEmpresa({ ...empresa, [n]: v })}
                  error={errors.nombre}
                  placeholder="Transportes García S.L."
                />
                <Field
                  label="CIF"
                  name="cif"
                  value={empresa.cif}
                  onChange={(n, v) => setEmpresa({ ...empresa, [n]: v.toUpperCase() })}
                  error={errors.cif}
                  placeholder="B12345678"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <select
                    value={empresa.sector}
                    onChange={(e) => setEmpresa({ ...empresa, sector: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.sector ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona un sector</option>
                    {sectores.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector}</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de vehículos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={empresa.vehiculos}
                    onChange={(e) => setEmpresa({ ...empresa, vehiculos: e.target.value })}
                    placeholder="10"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehiculos ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.vehiculos && <p className="text-red-500 text-xs mt-1">{errors.vehiculos}</p>}
                  {Number(empresa.vehiculos) >= 1 && (
                    <p className="text-blue-600 text-xs mt-1 font-medium">
                      Coste estimado: {(Number(empresa.vehiculos) * 8).toFixed(0)} €/mes
                    </p>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Continuar →
                </button>
              </>
            )}

            {/* Step 2 — Admin account */}
            {step === 1 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Tu cuenta de administrador</h2>
                <p className="text-gray-500 text-sm mb-5">Serás el responsable de gestionar la flota</p>

                <Field
                  label="Nombre completo"
                  name="nombre"
                  value={admin.nombre}
                  onChange={(n, v) => setAdmin({ ...admin, [n]: v })}
                  error={errors.nombre}
                  placeholder="Juan García López"
                />
                <Field
                  label="Email corporativo"
                  name="email"
                  type="email"
                  value={admin.email}
                  onChange={(n, v) => setAdmin({ ...admin, [n]: v })}
                  error={errors.email}
                  placeholder="juan@empresa.com"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={admin.password}
                      onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                      placeholder="Mínimo 8 caracteres"
                      className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 text-xs"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <Field
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  value={admin.confirmPassword}
                  onChange={(n, v) => setAdmin({ ...admin, [n]: v })}
                  error={errors.confirmPassword}
                  placeholder="Repite la contraseña"
                />

                <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700">
                    Al registrarte aceptas los <span className="underline cursor-pointer">Términos de uso</span> y la{' '}
                    <span className="underline cursor-pointer">Política de privacidad</span> de Órbita.
                    Tus datos se tratan bajo RGPD con servidores en la UE.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    Crear cuenta
                  </button>
                </div>
              </>
            )}

            {/* Step 3 — Confirmation */}
            {step === 2 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">¡Cuenta creada!</h2>
                <p className="text-gray-500 text-sm mb-6">
                  {empresa.nombre} ya está en Órbita. Comparte el código con tus conductores.
                </p>

                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <p className="text-gray-400 text-xs mb-1">Código de empresa</p>
                  <p className="text-white text-2xl font-mono font-bold tracking-widest">
                    {generateCode(empresa.nombre || 'ORB')}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Los conductores lo introducen al instalar la app
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Empresa</span>
                    <span className="font-medium text-gray-900">{empresa.nombre}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">CIF</span>
                    <span className="font-medium text-gray-900">{empresa.cif}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Vehículos</span>
                    <span className="font-medium text-gray-900">{empresa.vehiculos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Administrador</span>
                    <span className="font-medium text-gray-900">{admin.nombre}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-sm">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-bold text-blue-600">
                      {Number(empresa.vehiculos) * 8} €/mes · 14 días gratis
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Aquí irías al dashboard')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Ir al panel de control →
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          ¿Ya tienes cuenta? <span className="text-blue-600 cursor-pointer">Inicia sesión</span>
        </p>
      </div>
    </div>
  );
}
