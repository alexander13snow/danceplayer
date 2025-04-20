import React, { useState } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Header,
  FormItem,
  Input,
  Button,
  SimpleCell,
  Div,
} from '@vkontakte/vkui';
import { Icon28PlayCircle } from '@vkontakte/icons';

const isValidAudioLink = (link) => {
  // теперь разрешаем любые http/https ссылки
  return /^https?:\/\/.+/.test(link);
};

export const Home = ({ id }) => {
  const [audioLinks, setAudioLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [currentAudio, setCurrentAudio] = useState(null);

  const handleAddLink = () => {
    if (isValidAudioLink(newLink)) {
      setAudioLinks((prev) => [...prev, newLink]);
      setNewLink('');
    } else {
      alert('Введите корректную ссылку (начинающуюся с http:// или https://)');
    }
  };

  const handlePlay = (link) => {
    setCurrentAudio(link);
  };

  return (
    <Panel id={id}>
      <PanelHeader>🎧 ТанцПлеер</PanelHeader>

      <Group header={<Header mode="secondary">Добавить ссылку на трек</Header>}>
        <FormItem top="Ссылка на трек">
          <Input
            placeholder="Вставьте ссылку на трек (например, https://...)"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
        </FormItem>
        <Div>
          <Button size="l" stretched onClick={handleAddLink}>
            Добавить трек
          </Button>
        </Div>
      </Group>

      <Group header={<Header mode="secondary">Список треков</Header>}>
        {audioLinks.length === 0 ? (
          <Div>Треков пока нет</Div>
        ) : (
          audioLinks.map((link, idx) => (
            <SimpleCell
              key={idx}
              subtitle={link}
              after={<Icon28PlayCircle onClick={() => handlePlay(link)} />}
            >
              Трек {idx + 1}
            </SimpleCell>
          ))
        )}
      </Group>

      {currentAudio && (
        <Group header={<Header mode="secondary">Сейчас играет</Header>}>
          <Div>
            <audio src={currentAudio} controls autoPlay style={{ width: '100%' }} />
          </Div>
        </Group>
      )}
    </Panel>
  );
};
