import { createGunzip, createInflate, Gunzip, Inflate } from 'zlib';
import { DashboardClient, KlasaIncomingMessage, Middleware, MiddlewareStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Middleware {

	public constructor(client: DashboardClient, store: MiddlewareStore, file: string[], directory: string) {
		super(client, store, file, directory, { priority: 20 });
	}

	public async run(request: KlasaIncomingMessage): Promise<void> {
		if (request.method !== 'POST') return;

		const stream = this.contentStream(request);
		let body = '';

		for await (const chunk of stream) body += chunk;

		const data = JSON.parse(body);
		request.body = data;
	}

	public contentStream(request: KlasaIncomingMessage): Inflate | Gunzip | KlasaIncomingMessage {
		const length = request.headers['content-length'];
		let stream;
		switch ((request.headers['content-encoding'] || 'identity').toLowerCase()) {
			case 'deflate':
				stream = createInflate();
				request.pipe(stream);
				break;
			case 'gzip':
				stream = createGunzip();
				request.pipe(stream);
				break;
			case 'identity':
				stream = request;
				stream.length = length;
		}
		return stream;
	}

}
