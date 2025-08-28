import React, { useState, useEffect } from 'react';
import { StyleSheet,Text, View,TextInput,TouchableOpacity,FlatList, Alert, SafeAreaView,} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    carregarTarefas();
  }, []);

  useEffect(() => {
    salvarTarefas();
  }, [tarefas]);

  const carregarTarefas = async () => {
    try {
      const tarefasSalvas = await AsyncStorage.getItem('@minhas_tarefas');
      if (tarefasSalvas && tarefasSalvas !== 'null') {
        const listaTarefas = tarefasSalvas.split('###').filter(t => t.length > 0).map(item => {
          const [id, texto] = item.split('|||');
          return { id, texto };
        });
        setTarefas(listaTarefas);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const salvarTarefas = async () => {
    try {
      const tarefasString = tarefas.map(t => `${t.id}|||${t.texto}`).join('###');
      await AsyncStorage.setItem('@minhas_tarefas', tarefasString);
      console.log('Tarefas salvas:', tarefas.length);
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const adicionarTarefa = () => {
    if (tarefa.trim() === '') {
      Alert.alert('Atenção', 'Por favor, digite uma tarefa válida!');
      return;
    }

    const novaTarefa = {
      id: Date.now().toString(),
      texto: tarefa,
    };
    console.log('Adicionando nova tarefa:', novaTarefa);
    setTarefas([...tarefas, novaTarefa]);
    setTarefa('');
  };

  const excluirTarefa = (id) => {
    console.log('Função excluirTarefa chamada com ID:', id);
    console.log('Tarefas antes da exclusão:', tarefas.length);
    
    const novasTarefas = tarefas.filter(item => item.id !== id);
    console.log('Tarefas após filtro:', novasTarefas.length);
    setTarefas(novasTarefas);
  };

  const limparTodasTarefas = () => {
    console.log('Limpando todas as tarefas. Total antes:', tarefas.length);
    setTarefas([]);
  };

  const renderizarTarefa = ({ item }) => (
    <View style={styles.itemTarefa}>
      <View style={styles.textoContainer}>
        <Text style={styles.textoTarefa}>
          {item.texto}
        </Text>
      </View>
      
      <View style={styles.botoesAcao}>
        <TouchableOpacity 
          style={styles.botaoExcluir}
          onPress={() => {
            console.log('=== BOTÃO EXCLUIR PRESSIONADO ===');
            console.log('Item ID:', item.id);
            console.log('Item texto:', item.texto);
            console.log('Total de tarefas:', tarefas.length);
            excluirTarefa(item.id);
          }}
        >
          <Text style={styles.textoBotao}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2196F3" />
      
      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de Tarefas</Text>
        <Text style={styles.contadorTexto}>
          Total: {tarefas.length} tarefas
        </Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua tarefa:"
            value={tarefa}
            onChangeText={setTarefa}
            maxLength={100}
          />
          <TouchableOpacity 
            style={styles.botaoAdicionar}
            onPress={adicionarTarefa}
          >
            <Text style={styles.textoBotaoAdicionar}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.botaoLimpar}
            onPress={limparTodasTarefas}
          >
            <Text style={styles.textoBotaoLimpar}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={renderizarTarefa}
          showsVerticalScrollIndicator={false}
          style={styles.lista}
          ListEmptyComponent={
            <View style={styles.listaVazia}>
              <Text style={styles.textoListaVazia}>
                Não há tarefas adcionadas
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ff94ce',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contadorTexto: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  botaoLimpar: {
    backgroundColor: '#ff1694',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  textoBotaoLimpar: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  conteudo: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  botaoAdicionar: {
    backgroundColor: '#ff45aa',
    borderRadius: 8,
    padding: 15,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoAdicionar: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  lista: {
    flex: 1,
  },
  itemTarefa: {
    backgroundColor: '#ffafda',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoContainer: {
    flex: 1,
    marginRight: 10,
  },
  textoTarefa: {
    fontSize: 16,
    color: '#333',
  },
  botoesAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  botaoExcluir: {
    backgroundColor: '#ff3ba5',
    borderRadius: 6,
    padding: 10,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotao: {
    fontSize: 16,
    color: '#fff',
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  textoListaVazia: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
