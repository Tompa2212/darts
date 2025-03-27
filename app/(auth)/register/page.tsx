import React, { Suspense } from 'react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { RegisterForm } from '../_components/register-form';
import { cn } from '@/lib/utils';
import {
  Target,
  Trophy,
  Users,
  History,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="bg-background-light">
      <div className="container mx-auto px-4 py-10 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-6 text-success-500 animate-pulse" />
                <h1 className="text-3xl lg:text-4xl font-bold text-text-light-primary">
                  Darts Scoring Made Simple
                </h1>
              </div>
              <p className="text-text-light-secondary text-base lg:text-lg">
                Track your darts games, analyze your performance, and compete
                with friends in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-light p-4 rounded-lg border border-zinc-200 hover:border-primary-500/20 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-50">
                    <Target className="size-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary font-semibold mb-2">
                      Multiple Game Modes
                    </h3>
                    <p className="text-text-light-secondary text-sm">
                      Support for 501, 701, Cricket, and more classic darts
                      games
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-light p-4 rounded-lg border border-zinc-200 hover:border-primary-500/20 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-success-50">
                    <Trophy className="size-5 text-success-500" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary font-semibold mb-2">
                      Real-time Stats
                    </h3>
                    <p className="text-text-light-secondary text-sm">
                      Track averages, checkout percentages, and highest scores
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-light p-4 rounded-lg border border-zinc-200 hover:border-primary-500/20 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-warning-50">
                    <Users className="size-5 text-warning-500" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary font-semibold mb-2">
                      Team Support
                    </h3>
                    <p className="text-text-light-secondary text-sm">
                      Create teams, invite players, and compete together
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-light p-4 rounded-lg border border-zinc-200 hover:border-primary-500/20 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-50">
                    <History className="size-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-text-light-primary font-semibold mb-2">
                      Game History
                    </h3>
                    <p className="text-text-light-secondary text-sm">
                      Save and review your past games and progress
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                className={cn(
                  buttonVariants(),
                  'group flex items-center gap-2'
                )}
                href="/about"
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="p-6 lg:p-8 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="size-5 text-success-500" />
              <h2 className="text-xl font-semibold text-text-light-primary">
                Create Your Account
              </h2>
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
