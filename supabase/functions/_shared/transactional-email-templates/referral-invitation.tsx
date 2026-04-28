import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Créa Facile'
const SITE_URL = 'https://creafacile.com'

interface ReferralInvitationProps {
  inviterName?: string
  referralCode?: string
  signupUrl?: string
}

const ReferralInvitationEmail = ({
  inviterName,
  referralCode,
  signupUrl,
}: ReferralInvitationProps) => {
  const url = signupUrl || `${SITE_URL}/auth?ref=${referralCode || ''}`
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>{inviterName ? `${inviterName} vous invite sur ${SITE_NAME}` : `Découvrez ${SITE_NAME}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {inviterName ? `${inviterName} vous invite sur ${SITE_NAME} 🎁` : `Vous êtes invité sur ${SITE_NAME} 🎁`}
          </Heading>
          <Text style={text}>
            {SITE_NAME} est l'outil IA qui crée vos contenus marketing (images, vidéos, carrousels)
            en quelques secondes — sans compétences techniques.
          </Text>
          <Text style={text}>
            Inscrivez-vous gratuitement et recevez des crédits offerts pour tester l'app dès maintenant.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button href={url} style={button}>
              Créer mon compte gratuit
            </Button>
          </Section>
          <Text style={small}>
            Ou copiez ce lien : <span style={{ color: '#000' }}>{url}</span>
          </Text>
          <Text style={footer}>L'équipe {SITE_NAME}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ReferralInvitationEmail,
  subject: (data: Record<string, any>) =>
    data?.inviterName
      ? `${data.inviterName} vous invite sur ${SITE_NAME} 🎁`
      : `Vous êtes invité sur ${SITE_NAME} 🎁`,
  displayName: 'Invitation parrainage',
  previewData: {
    inviterName: 'Marie',
    referralCode: 'AB12',
    signupUrl: 'https://creafacile.com/auth?ref=AB12',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#000000', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const small = { fontSize: '12px', color: '#6b7280', margin: '16px 0 0', wordBreak: 'break-all' as const }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '32px 0 0' }
const button = {
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
}