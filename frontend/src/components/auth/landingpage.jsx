import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Landingpage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Doctors", href: "#doctors" },
    { name: "Appointments", href: "#appointments" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          {/* Logo */}
          <div className="flex flex-1">
            <a href="#home" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-extrabold text-blue-700">
                  MediCare
                </h1>

                <p className="hidden text-xs text-slate-500 sm:block">
                  Hospital Management System
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Login / Register */}
          <div className="hidden flex-1 items-center justify-end gap-5 lg:flex">

            <Link
              to="/register"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              Login
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-700 lg:hidden"
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
        </nav>

        {/* Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50 bg-black/20" />

          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white p-6 sm:max-w-sm">

            {/* Mobile Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartIcon className="h-8 w-8 text-blue-600" />

                <span className="text-xl font-bold text-blue-700">
                  MediCare
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="mt-8 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Mobile Login/Register */}
            <div className="mt-6 border-t pt-6">

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-600"
              >
                Register
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-3 font-semibold hover:bg-blue-50 hover:text-blue-600"
              >
                Login
              </Link>

            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Hero Section */}
      <main
        id="home"
        className="flex min-h-screen items-center justify-center bg-blue-50 px-6 pt-20"
      >
        <div className="max-w-3xl text-center">

          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
            Quality Healthcare,
            <span className="text-blue-600"> Simplified</span>
          </h1>

          <p className="mt-8 text-lg text-slate-600 sm:text-xl">
            Manage patients, appointments, doctors, and hospital services
            efficiently with our modern Hospital Management System.
          </p>

          <div className="mt-10 flex justify-center gap-5">

            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Book Appointment
            </Link>

            <a
              href="#services"
              className="py-3 text-sm font-semibold text-slate-900 hover:text-blue-600"
            >
              Our Services →
            </a>

          </div>
        </div>
      </main>

    </div>
  );
};

export default Landingpage;