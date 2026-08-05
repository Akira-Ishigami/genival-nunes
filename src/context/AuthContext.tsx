import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

// Formato mínimo de usuário/sessão usado pelo cliente local de demonstração
// (lib/demoClient.ts) — bem mais simples que os tipos reais do supabase-js.
type User = { id: string; email: string };
type Session = { user: User };

interface AuthCtx {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = setTimeout(() => setLoading(false), 7000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_ev, s) => {
      clearTimeout(fallback);
      const u = s?.user ?? null;

      if (!u) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const p = await fetchProfile(u.id);
        if (!p || p.role !== 'admin') {
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setProfile(null);
        } else {
          setUser(u);
          setSession(s);
          setProfile(p);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(fallback);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <Ctx.Provider value={{ user, session, profile, loading, isAdmin: !!profile, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
