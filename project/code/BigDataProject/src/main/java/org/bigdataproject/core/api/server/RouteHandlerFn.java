package org.bigdataproject.core.api.server;

import java.util.function.BiConsumer;

public interface RouteHandlerFn extends BiConsumer<Request, Response> {}