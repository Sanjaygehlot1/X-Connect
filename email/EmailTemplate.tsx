import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function EmailTemplate({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto, Arial, sans-serif"
          fallbackFontFamily="Arial"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        <Row>
          <Heading as="h2" style={{ textAlign: 'center', color: '#333' }}>
            Hello {username},
          </Heading>
        </Row>
        <Row>
          <Text style={{ textAlign: 'center', fontSize: '16px', color: '#555' }}>
            Thank you for registering. Use the following verification code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text style={{
            fontSize: '22px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#000',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '5px',
            display: 'inline-block',
            border: '1px solid #ddd'
          }}>
            {otp}
          </Text>
        </Row>
        <Row>
          <Text style={{ textAlign: 'center', fontSize: '14px', color: '#777' }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
