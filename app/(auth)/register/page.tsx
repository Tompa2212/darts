import React, { Suspense } from 'react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { RegisterForm } from '../_components/register-form';
import { cn } from '@/lib/utils';
import { Target, Trophy, Users, History, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="bg-background-light">
      <div className="container mx-auto px-4 py-10 sm:pt-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8 lg:space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-success-500 size-6 animate-pulse" />
                <h1 className="text-text-light-primary text-3xl font-bold lg:text-4xl">
                  Darts Scoring Made Simple
                </h1>
              </div>
              <p className="text-text-light-secondary text-base lg:text-lg">
                Track your darts games, analyze your performance, and compete with friends in
                real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-surface-light hover:border-primary-500/20 group rounded-lg border border-zinc-200 p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 rounded-lg p-2">
                    <Target className="text-primary-500 size-5" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary mb-2 font-semibold">
                      Multiple Game Modes
                    </h3>
                    <p className="text-text-light-secondary text-sm">
                      Support for 501, 701, Cricket, and more classic darts games
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-light hover:border-primary-500/20 group rounded-lg border border-zinc-200 p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-success-50 rounded-lg p-2">
                    <Trophy className="text-success-500 size-5" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary mb-2 font-semibold">Real-time Stats</h3>
                    <p className="text-text-light-secondary text-sm">
                      Track averages, checkout percentages, and highest scores
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-light hover:border-primary-500/20 group rounded-lg border border-zinc-200 p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-warning-50 rounded-lg p-2">
                    <Users className="text-warning-500 size-5" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary mb-2 font-semibold">Team Support</h3>
                    <p className="text-text-light-secondary text-sm">
                      Create teams, invite players, and compete together
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-light hover:border-primary-500/20 group rounded-lg border border-zinc-200 p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 rounded-lg p-2">
                    <History className="text-primary-500 size-5" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary mb-2 font-semibold">Game History</h3>
                    <p className="text-text-light-secondary text-sm">
                      Save and review your past games and progress
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link className={cn(buttonVariants(), 'group flex items-center gap-2')} href="/about">
                Learn More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] lg:p-8">
            <div className="mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-success-500 size-5" />
              <h2 className="text-text-light-primary text-xl font-semibold">Create Your Account</h2>
            </div>
            <Suspense>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
