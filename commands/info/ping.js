module.exports = {
	name: 'ping',
	category: 'info',
	description: 'returns latency and API ping',
	run: async (client, message, args) => {
		const msg = await message.channel.send('Pinging...');

		msg.edit(`Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ping)}ms`);
	}
};