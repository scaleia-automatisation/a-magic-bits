import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Créa Facile'

interface PartnershipRequestProps {
  fromName?: string
  fromEmail?: string
  partnerType?: string
  audienceSize?: string
  message?: string
}

const PartnershipRequestEmail = ({
  fromName,
  fromEmail,
  partnerType,
  audienceSize,
  message,
}: PartnershipRequestProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouvelle demande de partenariat — {fromName || 'Anonyme'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nouvelle demande de partenariat 🤝</Heading>
        <Text style={label}>De</Text>
        <Text style={value}>{fromName || '—'} ({fromEmail || '—'})</Text>
        <Text style={label}>Type</Text>
        <Text style={value}>{partnerType || '—'}</Text>
        <Text style={label}>Taille audience</Text>
        <Text style={value}>{audienceSize || '—'}</Text>
        <Hr style={hr} />
        <Text style={label}>Message</Text>
        <Text style={value}>{message || '—'}</Text>
        <Hr style={hr} />
        <Text style={footer}>Notification automatique {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PartnershipRequestEmail,
  subject: (data: Record<string, any>) =>
    `Nouvelle demande de partenariat — ${data?.fromName || 'Anonyme'}`,
  displayName: 'Demande de partenariat',
  previewData: {
    fromName: 'Léa Dupont',
    fromEmail: 'lea@example.com',
    partnerType: 'Influenceuse',
    audienceSize: '50K abonnés Instagram',
    message: 'Bonjour, je serais intéressée par un partenariat...',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#000000', margin: '0 0 24px' }
const label = { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '12px 0 4px' }
const value = { fontSize: '15px', color: '#111827', lineHeight: '1.6', margin: '0 0 8px', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '24px 0 0' }