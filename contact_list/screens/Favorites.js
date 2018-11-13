import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import { fetchContacts } from '../utils/api';
import ContactThumbnail from '../components/ContactThumbnail';

const keyExtractor = ({ phone }) => phone;

export default class Favorites extends Component {

    static navigationOptions = {
        title: 'Favorites',
    };

    state = {
        contacts: [],
        loading: true,
        error: false,
    }

    async componentDidMount() {
        try {
            const contacts = await fetchContacts();
            
            this.setState({
                contacts,
                loading: false,
                error: false,
            });

        } catch {
            this.setState({
                loading: false,
                error: true,
            });
        }
    }

    renderFavoriteThumbnail = ({ item }) => {
        const { navigation: { navigate } } = this.props;
        const { avatar } = item;

        return (
            <ContactThumbnail
                avatar={avatar}
                onPress={() => navigate('Profile', { contact: item })}
            />
        );
    }

    render() {
        const { contacts, loading, error } = this.state;
        const favorites = contacts.filter(contact => contact.favorite);

        return(
            <View style={styles.container}>
                {loading && <ActivityIndicator size="large" />}
                {error && <Text>Error...</Text>}

                {!loading &&
                    !error && (
                        <FlatList
                            data={favorites}
                            numColumns={3}
                            contentContainerStyle={styles.list}
                            renderItem={this.renderFavoriteThumbnail} 
                            keyExtractor={keyExtractor}
                            />
                    )}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        flex: 1,
    },
    list: {
        alignItems: 'center',
    },
});