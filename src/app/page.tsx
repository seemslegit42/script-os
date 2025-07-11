
"use client";

import React, { useActionState, useRef, useEffect, useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeForm } from "@/components/scribe-form";
import { createSigilAction } from "./actions";
import { useTypographicState } from "@/context/typographic-state-context";
import { Header } from "@/components/header";
import Head from "next/head";
import { InterrogationPanel } from "@/components/scribe/interrogation-panel";
import { OraclePanel } from "@/components/scribe/oracle-panel";


const initialState = { sigil: null, sigilImageUrl: null, error: null, query: '' };

export default function ScriptoriumLayout() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createSigilAction, initialState);
  const { sigil } = state;
  const { applyState, currentState } = useTypographicState();
 
  useEffect(() => {
    if (isPending) {
      applyState('active');
    } else if (currentState !== 'default') {
      applyState('default');
    }
  }, [isPending, applyState, currentState]);
  
  const sigilContext = sigil ? `${sigil.why}\n\n${sigil.how}` : '';

  return (
    <>
      <Head>
        <title>Scriptorium | Scribe</title>
      </Head>
      <AethericStreams />
      <Header />
      
      <main className="container mx-auto p-4 sm:p-8 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <ScribeForm formAction={formAction} formRef={formRef} isPending={isPending} />
                <OraclePanel state={state} isPending={isPending} />
            </div>
            <div className="h-full">
                <InterrogationPanel context={sigilContext} />
            </div>
        </div>
      </main>
    </>
  );
}

