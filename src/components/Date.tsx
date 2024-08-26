import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import React from 'react';

export default function Date() {
  return (
    <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
      <div className="flex items-center text-gray-900">
        <button
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <section className="flex-auto text-sm font-semibold">
          <div className="flex justify-between">
            <div className="text-gray-400">
              <span className="block text-lg">19</span>
              <span className="text-uppercase block text-[0.65rem]">SUN</span>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="block text-blue-500 text-lg">20</span>
              <span className="text-uppercase text-[0.65rem] text-gray-400 block">
                MON
              </span>
            </div>
            <div className="text-gray-400">
              <span className="block text-lg">21</span>
              <span className="text-uppercase text-[0.65rem] block">Tue</span>
            </div>
            <div className="text-gray-400">
              <span className="block text-lg">22</span>
              <span className="text-uppercase text-[0.65rem] block">Wed</span>
            </div>
            <div className="text-gray-400">
              <span className="block text-lg">23</span>
              <span className="text-uppercase text-[0.65rem] block">Thur</span>
            </div>
            <div className="text-gray-400">
              <span className="block text-lg">24</span>
              <span className="text-uppercase text-[0.65rem] block">Fri</span>
            </div>
          </div>
        </section>
        <button
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
