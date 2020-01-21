import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    respositories: [],
    loading: false,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const respositories = localStorage.getItem('respositories');
    if (respositories) {
      this.setState({ respositories: JSON.parse(respositories) });
    }
  }

  // Salvar dados no localStorage
  componentDidUpdate(_, prevState) {
    const { respositories } = this.state;
    if (prevState.respositories !== respositories) {
      localStorage.setItem('respositories', JSON.stringify(respositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { newRepo, respositories } = this.state;
    this.setState({ loading: true });
    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    this.setState({
      respositories: [...respositories, data],
      newRepo: '',
      loading: false,
    });
  };

  render() {
    const { newRepo, loading, respositories } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt size={40} />
          Respositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar respositórios"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {respositories.map(repostoty => (
            <li key={repostoty.name}>
              <span>{repostoty.name}</span>
              <Link to={`/repository/${encodeURIComponent(repostoty.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
