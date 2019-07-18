// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { METHODS } from 'http';
import { Store } from '../../../klasa/lib/structures/base/Store';
import { DashboardClient } from '../DashboardClient';
import { METHODS_LOWER } from '../util/constants';
import { ConstructorType } from '../util/Util';
import { Route } from './Route';

/**
 * The HTTP methods
 */
export enum HttpMethods {
	/**
	 * The ACL method modifies the Access Control List
	 */
	'ACL',
	/**
	 * The BIND method modifies the collection identified by the Request-URI,
	 * by adding a new binding from the segment specified in the BIND body to
	 * the resource identified in the BIND body.
	 */
	'BIND',
	/**
	 * A CHECKOUT request can be applied to a checked-in version-controlled
	 * resource to allow modifications to the content and dead properties of
	 * that version-controlled resource.
	 */
	'CHECKOUT',
	/**
	 * The CONNECT method requests that the recipient establish a tunnel to the
	 * destination origin server identified by the request-target and, if
	 * successful, thereafter restrict its behavior to blind forwarding of
	 * packets, in both directions, until the tunnel is closed. Tunnels are
	 * commonly used to create an end-to-end virtual connection, through one or
	 * more proxies, which can then be secured using TLS (Transport Layer
	 * Security).
	 */
	'CONNECT',
	/**
	 * The COPY method creates a duplicate of the source resource identified by
	 * the Request-URI, in the destination resource identified by the URI in the
	 * Destination header. The Destination header MUST be present. The exact
	 * behavior of the COPY method depends on the type of the source resource.
	 */
	'COPY',
	/**
	 * The DELETE method requests that the origin server remove the association
	 * between the target resource and its current functionality. In effect,
	 * this method is similar to the rm command in UNIX: it expresses a deletion
	 * operation on the URI mapping of the origin server rather than an
	 * expectation that the previously associated information be deleted.
	 */
	'DELETE',
	/**
	 * The GET method requests transfer of a current selected representation for
	 * the target resource. GET is the primary mechanism of information retrieval
	 * and the focus of almost all performance optimizations. Hence, when people
	 * speak of retrieving some identifiable information via HTTP, they are
	 * generally referring to making a GET request.
	 */
	'GET',
	/**
	 * The HEAD method is identical to GET except that the server MUST NOT send
	 * a message body in the response (i.e., the response terminates at the end
	 * of the header section). The server SHOULD send the same header fields in
	 * response to a HEAD request as it would have sent if the request had been
	 * a GET, except that the payload header fields MAY be omitted. This method
	 * can be used for obtaining metadata about the selected representation
	 * without transferring the representation data and is often used for
	 * testing hypertext links for validity, accessibility, and recent
	 * modification.
	 */
	'HEAD',
	/**
	 * The LINK method is used to establish one or more relationships between
	 * the resource identified by the effective request URI and one or more
	 * other resources.
	 */
	'LINK',
	/**
	 * The LOCK method is used to take out a lock of any access type and to
	 * refresh an existing lock.
	 */
	'LOCK',
	/**
	 * The MERGE method performs the logical merge of a specified version (the
	 * “merge source”) into a specified version-controlled resource (the “merge
	 * target”). If the merge source is neither an ancestor nor a descendant of
	 * the DAV:checked-in or DAV:checked-out version of the merge target, the
	 * MERGE checks out the merge target (if it is not already checked out) and
	 * adds the URL of the merge source to the DAV:merge-set of the merge target.
	 */
	'MERGE',
	/**
	 * A MKACTIVITY request creates a new activity resource. A server MAY
	 * restrict activity creation to particular collections, but a client can
	 * determine the location of these collections from a
	 * DAV:activity-collection-set OPTIONS request.
	 */
	'MKACTIVITY',
	/**
	 * An HTTP request using the MKCALENDAR method creates a new calendar
	 * collection resource. A server MAY restrict calendar collection creation
	 * to particular collections.
	 */
	'MKCALENDAR',
	/**
	 * MKCOL creates a new collection resource at the location specified by the
	 * Request-URI. If the Request-URI is already mapped to a resource, then the
	 * MKCOL MUST fail. During MKCOL processing, a server MUST make the
	 * Request-URI an internal member of its parent collection, unless the
	 * Request-URI is “/”. If no such ancestor exists, the method MUST fail.
	 * When the MKCOL operation creates a new collection resource, all ancestors
	 * MUST already exist, or the method MUST fail with a 409 (Conflict) status
	 * code.
	 */
	'MKCOL',
	/**
	 * The MOVE operation on a non-collection resource is the logical equivalent
	 * of a copy (COPY), followed by consistency maintenance processing,
	 * followed by a delete of the source, where all three actions are performed
	 * in a single operation. The consistency maintenance step allows the server
	 * to perform updates caused by the move, such as updating all URLs, other
	 * than the Request-URI that identifies the source resource, to point to the
	 * new destination resource.
	 */
	'MOVE',
	/**
	 * The OPTIONS method requests information about the communication options
	 * available for the target resource, at either the origin server or an
	 * intervening intermediary. This method allows a client to determine the
	 * options and/or requirements associated with a resource, or the
	 * capabilities of a server, without implying a resource action.
	 */
	'OPTIONS',
	/**
	 * The PATCH method requests that a set of changes described in the request
	 * entity be applied to the resource identified by the Request-URI. The set
	 * of changes is represented in a format called a “patch document”
	 * identified by a media type. If the Request-URI does not point to an
	 * existing resource, the server MAY create a new resource, depending on the
	 * patch document type (whether it can logically modify a null resource) and
	 * permissions, etc.
	 */
	'PATCH',
	/**
	 * The POST method requests that the target resource process the
	 * representation enclosed in the request according to the resource’s own
	 * specific semantics.
	 */
	'POST',
	/**
	 * The PROPFIND method retrieves properties defined on the resource
	 * identified by the Request-URI, if the resource does not have any internal
	 * members, or on the resource identified by the Request-URI and potentially
	 * its member resources, if the resource is a collection that has internal
	 * member URLs.
	 */
	'PROPFIND',
	/**
	 * The PROPPATCH method processes instructions specified in the request body
	 * to set and/or remove properties defined on the resource identified by the
	 * Request-URI.
	 */
	'PROPPATCH',
	/**
	 * The PUT method requests that the state of the target resource be created
	 * or replaced with the state defined by the representation enclosed in the
	 * request message payload. A successful PUT of a given representation would
	 * suggest that a subsequent GET on that same target resource will result in
	 * an equivalent representation being sent in a 200 (OK) response. However,
	 * there is no guarantee that such a state change will be observable, since
	 * the target resource might be acted upon by other user agents in parallel,
	 * or might be subject to dynamic processing by the origin server, before
	 * any subsequent GET is received. A successful response only implies that
	 * the user agent’s intent was achieved at the time of its processing by the
	 * origin server.
	 */
	'PUT',
	/**
	 * The REBIND method removes a binding to a resource from a collection, and
	 * adds a binding to that resource into the collection identified by the
	 * Request-URI. The request body specifies the binding to be added (segment)
	 * and the old binding to be removed (href). It is effectively an atomic
	 * form of a MOVE request, and MUST be treated the same way as MOVE for the
	 * purpose of determining access permissions.
	 */
	'REBIND',
	/**
	 * A REPORT request is an extensible mechanism for obtaining information
	 * about a resource. Unlike a resource property, which has a single value,
	 * the value of a report can depend on additional information specified in
	 * the REPORT request body and in the REPORT request headers.
	 */
	'REPORT',
	/**
	 * The client invokes the SEARCH method to initiate a server-side search.
	 * The body of the request defines the query. The server MUST emit an entity
	 * matching the WebDAV multistatus format.
	 */
	'SEARCH',
	/**
	 * The TRACE method requests a remote, application-level loop-back of the
	 * request message. The final recipient of the request SHOULD reflect the
	 * message received, excluding some fields described below, back to the
	 * client as the message body of a 200 (OK) response with a Content-Type of
	 * “message/http”. The final recipient is either the origin server or the
	 * first server to receive a Max-Forwards value of zero (0) in the request.
	 */
	'TRACE',
	/**
	 * The UNBIND method modifies the collection identified by the Request-URI
	 * by removing the binding identified by the segment specified in the UNBIND
	 * body.
	 */
	'UNBIND',
	/**
	 * The UNLINK method is used to remove one or more relationships between the
	 * resource identified by the effective request URI and other resources.
	 */
	'UNLINK',
	/**
	 * The UNLOCK method removes the lock identified by the lock token in the
	 * Lock-Token request header. The Request-URI MUST identify a resource
	 * within the scope of the lock.
	 */
	'UNLOCK'
}

/**
 * The route store registry type
 */
export type RouteStoreRegistry = Record<keyof typeof HttpMethods, Map<string, Route>>;

export class RouteStore extends Store<string, Route, ConstructorType<Route>> {

	public registry: Partial<RouteStoreRegistry> = {};

	public constructor(client: DashboardClient) {
		super(client, 'routes', Route);
		for (const method of METHODS) this.registry[method] = new Map();
	}

	/**
	 * Finds a route using the registry
	 * @param method The http method
	 * @param splitURL the url to find
	 */
	public findRoute(method: keyof typeof HttpMethods, splitURL: string[]): Route | undefined {
		for (const route of this.registry[method]!.values()) if (route.matches(splitURL)) return route;
		return undefined;
	}

	/**
	 * Clears the RouteStore
	 */
	public clear(): void {
		for (const method of METHODS) this.registry[method].clear();
		super.clear();
	}

	/**
	 * Adds a Route to this RouteStore
	 * @param piece The route to add to this store
	 */
	public set(piece: Route): Route | null {
		const route = super.set(piece);
		if (!route) return route;
		for (const method of METHODS) if (METHODS_LOWER[method] in route) this.registry[method].set(route.name, route);
		return route;
	}

	/**
	 * Deletes a Route from this RouteStore
	 * @param name The name of the Route or the Route
	 */
	public delete(name: Route | string): boolean {
		const route = this.resolve(name);
		if (!route) return false;
		for (const method of METHODS) this.registry[method].delete(route.name);
		return super.delete(route);
	}

}
