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

function generateCode(name) {
  const prefix = name.replace(/\s+/g, '').toUpperCase().slice(0, 4) || 'ORBI';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
  const [codigo, setCodigo] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function validateEmpresa() {
    const newErrors = {};
    const vehicleCount = Number(empresa.vehiculos);

    if (!empresa.nombre.trim()) newErrors.nombre = 'Introduce el nombre de la empresa';
    if (!empresa.cif.trim()) newErrors.cif = 'Introduce el CIF';
    else if (!/^[A-Z]\d{7}[0-9A-J]$/.test(empresa.cif.toUpperCase())) {
      newErrors.cif = 'Formato CIF no válido (ej: B12345678)';
    }
    if (!empresa.sector) newErrors.sector = 'Selecciona un sector';
    if (!vehicleCount || vehicleCount < 1) newErrors.vehiculos = 'Indica el número de vehículos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateAdmin() {
    const newErrors = {};

    if (!admin.nombre.trim()) newErrors.nombre = 'Introduce tu nombre';
    if (!admin.email.trim()) newErrors.email = 'Introduce tu email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) newErrors.email = 'Email no válido';
    if (admin.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (admin.password !== admin.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (step === 0 && validateEmpresa()) {
      setStep(1);
    } else if (step === 1 && validateAdmin()) {
      setCodigo(generateCode(empresa.nombre));
      setStep(2);
    }
  }

  const vehicleCount = Number(empresa.vehiculos) || 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <span className="text-lg font-bold text-white">O</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Órbita</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Control de flota para tu empresa</p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="px-6 pb-4 pt-6">
            <div className="mb-4 flex items-center justify-between">
              {steps.map((stepLabel, index) => (
                <div key={stepLabel} className="flex items-center">
                  <div className={`flex items-center gap-2 ${index <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        index < step
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : index === step
                            ? 'border-blue-600 text-blue-600'
                            : 'border-gray-300 text-gray-400'
                      }`}
                    >
                      {index < step ? '✓' : index + 1}
                    </div>
                    <span className="hidden text-xs font-medium sm:block">{stepLabel}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-2 h-0.5 w-12 ${index < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">
            {step === 0 && (
              <>
                <h1 className="mb-1 text-lg font-bold text-gray-900">Datos de la empresa</h1>
                <p className="mb-5 text-sm text-gray-500">Información básica para crear tu cuenta</p>

                <Field
                  label="Nombre de la empresa"
                  name="nombre"
                  value={empresa.nombre}
                  onChange={(name, value) => setEmpresa({ ...empresa, [name]: value })}
                  error={errors.nombre}
                  placeholder="Transportes García S.L."
                />
                <Field
                  label="CIF"
                  name="cif"
                  value={empresa.cif}
                  onChange={(name, value) => setEmpresa({ ...empresa, [name]: value.toUpperCase() })}
                  error={errors.cif}
                  placeholder="B12345678"
                />

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Sector</label>
                  <select
                    value={empresa.sector}
                    onChange={(event) => setEmpresa({ ...empresa, sector: event.target.value })}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.sector ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona un sector</option>
                    {sectores.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                  {errors.sector && <p className="mt-1 text-xs text-red-500">{errors.sector}</p>}
                </div>

                <div className="mb-6">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Número de vehículos</label>
                  <input
                    type="number"
                    min="1"
                    value={empresa.vehiculos}
                    onChange={(event) => setEmpresa({ ...empresa, vehiculos: event.target.value })}
                    placeholder="10"
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehiculos ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.vehiculos && <p className="mt-1 text-xs text-red-500">{errors.vehiculos}</p>}
                  {vehicleCount >= 1 && (
                    <p className="mt-1 text-xs font-medium text-blue-600">
                      Coste estimado: {(vehicleCount * 8).toFixed(0)} €/mes
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Continuar →
                </button>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="mb-1 text-lg font-bold text-gray-900">Tu cuenta de administrador</h1>
                <p className="mb-5 text-sm text-gray-500">Serás el responsable de gestionar la flota</p>

                <Field
                  label="Nombre completo"
                  name="nombre"
                  value={admin.nombre}
                  onChange={(name, value) => setAdmin({ ...admin, [name]: value })}
                  error={errors.nombre}
                  placeholder="Juan García López"
                />
                <Field
                  label="Email corporativo"
                  name="email"
                  type="email"
                  value={admin.email}
                  onChange={(name, value) => setAdmin({ ...admin, [name]: value })}
                  error={errors.email}
                  placeholder="juan@empresa.com"
                />

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={admin.password}
                      onChange={(event) => setAdmin({ ...admin, password: event.target.value })}
                      placeholder="Mínimo 8 caracteres"
                      className={`w-full rounded-lg border px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-xs text-gray-400"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <Field
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  value={admin.confirmPassword}
                  onChange={(name, value) => setAdmin({ ...admin, [name]: value })}
                  error={errors.confirmPassword}
                  placeholder="Repite la contraseña"
                />

                <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs text-blue-700">
                    Al registrarte aceptas los <span className="cursor-pointer underline">Términos de uso</span> y la{' '}
                    <span className="cursor-pointer underline">Política de privacidad</span> de Órbita. Tus datos se
                    tratan bajo RGPD con servidores en la UE.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    ← Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Crear cuenta
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-3xl">✓</span>
                </div>
                <h1 className="mb-1 text-xl font-bold text-gray-900">¡Cuenta creada!</h1>
                <p className="mb-6 text-sm text-gray-500">
                  {empresa.nombre} ya está en Órbita. Comparte el código con tus conductores.
                </p>

                <div className="mb-6 rounded-xl bg-gray-900 p-4">
                  <p className="mb-1 text-xs text-gray-400">Código de empresa</p>
                  <p className="font-mono text-2xl font-bold tracking-widest text-white">{codigo}</p>
                  <p className="mt-1 text-xs text-gray-400">Los conductores lo introducen al instalar la app</p>
                </div>

                <div className="mb-6 space-y-2 rounded-xl bg-gray-50 p-4 text-left">
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
                  <div className="flex justify-between border-t pt-2 text-sm">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-bold text-blue-600">{vehicleCount * 8} €/mes · 14 días gratis</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.alert('Aquí irías al dashboard')}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Ir al panel de control →
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          ¿Ya tienes cuenta? <span className="cursor-pointer text-blue-600">Inicia sesión</span>
        </p>
      </div>
    </main>
  );
}
