import React, { useEffect, useState, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Group, SimpleCell, Search, Slider, Button, Text } from '@vkontakte/vkui';
import { Icon28PlayCircleFillAzure } from '@vkontakte/icons';

const APP_ID = 53455629;

export const Home = ({ id }) => {
  const [token, setToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  // Получение токена
  useEffect(() => {
    async function fetchToken() {
      try {
        const result = await bridge.send('VKWebAppGetAuthToken', {
          app_id: APP_ID,
          scope: 'audio'
        });
        setToken(result.access_token);
      } catch (error) {
        console.error('Ошибка при получении токена:', error);
      }
    }
    fetchToken();
  }, []);

  // Получение треков пользователя
  useEffect(() => {
    if (!token) return;

    async function fetchMyMusic() {
      try {
        const response = await bridge.send('VKWebAppCallAPIMethod', {
          method: 'audio.get',
          params: {
            access_token: token,
            v: '5.131',
            count: 50
          }
        });
        const filtered = response.response.items.filter(track => track.url);
        setTracks(filtered);
      } catch (error) {
        console.error('Ошибка при получении треков:', error);
      }
    }

    fetchMyMusic();
  }, [token]);

  // Поиск треков
  const searchTracks = async (query) => {
    setSearchQuery(query);
    if (!query || !token) return;

    try {
      const response = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'audio.search',
        params: {
          access_token: token,
          v: '5.131',
          q: query,
          count: 30
        }
      });
      const filtered = response.response.items.filter(track => track.url);
      setTracks(filtered);
    } catch (error) {
      console.error('Ошибка при поиске:', error);
    }
  };

  // Управление скоростью
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <Panel id={id}>
      <PanelHeader>ТанцПлеер</PanelHeader>

      <Group>
        <Search
          value={searchQuery}
          onChange={(e) => searchTracks(e.target.value)}
          after={null}
          placeholder="Найти трек..."
        />
      </Group>

      <Group header={<Text weight="2">🎧 Список треков</Text>}>
        {tracks.map((track) => (
          <SimpleCell
            key={track.id}
            before={<Icon28PlayCircleFillAzure />}
            onClick={() => setSelectedTrack(track)}
            subtitle={track.artist}
            description={track.title}
          >
            {track.artist} — {track.title}
          </SimpleCell>
        ))}
        {!tracks.length && <Text>Нет доступных треков</Text>}
      </Group>

      {selectedTrack && (
        <Group header={<Text weight="2">🎛 Плеер</Text>}>
          <Text style={{ marginBottom: 8 }}>{selectedTrack.artist} — {selectedTrack.title}</Text>
          <audio
            ref={audioRef}
            src={selectedTrack.url}
            controls
            autoPlay
            style={{ width: '100%', marginBottom: 16 }}
          />
          <Text>Скорость: {playbackRate.toFixed(2)}x</Text>
          <Slider
            min={0.5}
            max={2}
            step={0.05}
            value={playbackRate}
            onChange={setPlaybackRate}
          />
        </Group>
      )}
    </Panel>
  );
};
