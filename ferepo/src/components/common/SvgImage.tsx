// RemoteSvg.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';

type Props = {
  uri: string;
  width?: number;
  height?: number;
};

export default function SvgImage({ uri, width = 20, height = 20 }: Props) {
  const [xml, setXml] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const finalUrl = normalizeS3SvgUrl(uri);
        // console.log('🔍 SVG fetch URL:', finalUrl);
        const res = await fetch(finalUrl);
        // console.log('🔍 SVG status:', res.status, res.statusText);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        // console.log('🔍 SVG text length:', text?.length ?? 0);
        if (mounted) setXml(text);
      } catch (e: any) {
        console.log('⛔ SVG fetch error:', e?.message || e);
        if (mounted) setErr(e?.message || 'error');
      }
    })();
    return () => { mounted = false; };
  }, [uri]);

  if (err) return null;                 // 필요 시 fallback UI
  if (!xml) return <ActivityIndicator />;
  return <SvgXml xml={xml} width={width} height={height} />;
}

function normalizeS3SvgUrl(raw: string) {
  // 1) 이미 인코딩되어 온 %XX 시퀀스는 복원
  const decodedOnce = decodeURI(raw);
  // 2) 다시 '정확히 한 번'만 인코딩
  const reencoded = encodeURI(decodedOnce);
  // 3) 경로의 '+'를 공백 인코딩으로 보정 (키에 공백이 있는 경우)
  return reencoded.replace(/\+/g, '%20');
}