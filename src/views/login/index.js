import React, { Component, PropTypes } from 'react';
import { showErrorNotification } from '../../helpers/common';

import styles from './styles.scss';

export default class Login extends Component {
  static propTypes = {
    router: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      firebaseAuth: this.props.router.routes[0].firebase && this.props.router.routes[0].firebase.auth(),
      email: '',
      password: '',
    };
  }

  componentWillMount() {
    // If firebaseAuth is not undefined: Set auth change listener
    if (this.state.firebaseAuth !== undefined) {
      this.state.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          // If logged in go to board
          if (this.props.location.pathname !== '/') {
            this.props.router.push('/');
          }
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // Once firebaseAuth is defined: Set auth change listener
    this.setState({
      firebaseAuth: nextProps.router.routes[0].firebase.auth(),
    });
    this.state.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        // If logged in go to board
        if (this.props.location.pathname !== '/') {
          this.props.router.push('/');
        }
      }
    });
  }

  // Supervised form element: Email
  _handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  // Supervised form element: Password
  _handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  }

  _loginRegister = () => {
    // Try login
    this.state.firebaseAuth.signInWithEmailAndPassword(this.state.email.toString(), this.state.password.toString())
        .catch((loginerror) => {
          if (loginerror.code === 'auth/user-not-found') {
            // If not found try register
            this.state.firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                .catch((registererror) => {
                  showErrorNotification(registererror.message);
                });
          } else {
            showErrorNotification(loginerror.message);
          }
        });

    return false;
  }

  render() {
    return (
      <div className={`container ${styles.loginContainer}`}>
        <div className={`row ${styles.loginRow}`}>
          <div className="col-md-8 col-md-offset-2">
            <h1 className={styles.headerTitle}>Login or Create an Account</h1>
            <div className="loginForm">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" name="email" placeholder="Email" value={this.state.email} onChange={this._handleEmailChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this._handlePasswordChange} />
              </div>
              <div className={styles.buttonContainer}>
                <button onClick={this._loginRegister} className={`btn btn-default ${styles.loginButton}`}>Login</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
