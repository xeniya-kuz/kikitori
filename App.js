import { useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Speech from 'expo-speech';
import html from './html';

const isJa = (v) => /^ja([-_]|$)/i.test(v.language || '');

export default function App() {
  const web = useRef(null);
  const jaVoice = useRef(null);
  const checked = useRef(false);

  const checkVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const ja = voices.filter(isJa);
      jaVoice.current = ja.find((v) => !v.networkConnectionRequired) || ja[0] || null;
      checked.current = true;
      web.current?.injectJavaScript(
        `document.getElementById('warn').classList.${ja.length ? 'remove' : 'add'}('show'); true;`
      );
    } catch {}
  };

  useEffect(() => { checkVoices(); }, []);

  const onMessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.nativeEvent.data); } catch { return; }
    if (msg.type !== 'speak') return;
    const done = () => web.current?.injectJavaScript('window.__ttsDone && window.__ttsDone(); true;');
    Speech.stop();
    Speech.speak(msg.text, {
      language: 'ja-JP',
      ...(jaVoice.current ? { voice: jaVoice.current.identifier } : {}),
      rate: typeof msg.rate === 'number' ? msg.rate : 1,
      onDone: done,
      onStopped: done,
      onError: done,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0B16" />
      <WebView
        ref={web}
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://kikitori.local' }}
        onMessage={onMessage}
        onLoadEnd={checkVoices}
        javaScriptEnabled
        domStorageEnabled
        overScrollMode="never"
        style={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0B16', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  web: { flex: 1, backgroundColor: '#0A0B16' },
});
