import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OpenAI from 'openai';

interface TextToSpeechProps {
  text: string;
  apiKey: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  model?: 'tts-1' | 'tts-1-hd';
  speed?: number;
  onError?: (error: string) => void;
  onSuccess?: () => void;
  style?: any;
  buttonStyle?: any;
  textStyle?: any;
  showText?: boolean;
  disabled?: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  apiKey,
  voice = 'alloy',
  model = 'tts-1',
  speed = 1.0,
  onError,
  onSuccess,
  style,
  buttonStyle,
  textStyle,
  showText = true,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const openai = useRef(new OpenAI({ apiKey, dangerouslyAllowBrowser: true }));

  const requestAudioPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission not granted');
      }
    } catch (err) {
      throw new Error('Failed to request audio permissions');
    }
  };

  const generateSpeech = async (inputText: string): Promise<string> => {
    try {
      const response = await openai.current.audio.speech.create({
        model,
        voice,
        input: inputText,
        speed,
        response_format: 'mp3',
      });

      // Convert the response to a blob URL
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      return url;
    } catch (err: any) {
      throw new Error(`OpenAI TTS Error: ${err.message || 'Failed to generate speech'}`);
    }
  };

  const playAudio = async (audioUrl: string) => {
    try {
      // Stop any currently playing audio
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Create and load the new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      // Set up playback status update
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

      setIsPlaying(true);
      onSuccess?.();
    } catch (err: any) {
      throw new Error(`Audio Playback Error: ${err.message || 'Failed to play audio'}`);
    }
  };

  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      const errorMsg = 'No text provided for speech generation';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Request audio permissions
      await requestAudioPermissions();

      // Generate speech using OpenAI TTS
      const audioUrl = await generateSpeech(text);

      // Play the generated audio
      await playAudio(audioUrl);
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setError(errorMsg);
      onError?.(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Error stopping audio:', err);
    }
  };

  const handlePress = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      handleTextToSpeech();
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const getButtonIcon = () => {
    if (isLoading) return 'hourglass-empty';
    if (isPlaying) return 'stop';
    return 'volume-up';
  };

  const getButtonText = () => {
    if (isLoading) return 'Generating...';
    if (isPlaying) return 'Stop';
    return 'Speak';
  };

  return (
    <View style={[styles.container, style]}>
      {showText && (
        <Text style={[styles.text, textStyle]} numberOfLines={3}>
          {text}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.button,
          buttonStyle,
          disabled && styles.disabledButton,
          error && styles.errorButton,
        ]}
        onPress={handlePress}
        disabled={disabled || isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Icon name={getButtonIcon()} size={20} color="#ffffff" />
        )}
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10a37f',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  errorButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
});

export default TextToSpeech;